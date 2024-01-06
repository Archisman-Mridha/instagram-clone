#![allow(non_snake_case)]

pub mod sql;

pub mod utils {
	use anyhow::anyhow;
  use autometrics::prometheus_exporter;
	use deadpool_postgres::{ManagerConfig, Pool, RecyclingMethod};
	use tokio::spawn;
	use tonic::{Status, Code};
	use warp::Filter;
  use std::{env, time::Duration};
  use tokio_postgres::NoTls;

	pub fn getEnv(name: &str) -> String {
    env::var(name).expect(&format!("ERROR: Getting env {}", name))}

	// initMetricsServer starts an HTTP server in a separate thread, which exposes application metrics
	// to Prometheus.
	pub fn initMetricsServer( ) {
		prometheus_exporter::init( );

		let routes= warp::get( )
											.and(warp::path("metrics"))
											.map(| | prometheus_exporter::encode_http_response( ));

		let address= ([0, 0, 0, 0], getEnv("METRICS_SERVER_PORT").parse( ).unwrap( ));
		let metricsServer= warp::serve(routes)
														 .run(address);

		println!("INFO: Starting metrics server");
		spawn(metricsServer);
	}

	pub mod distributedTracing {
		use opentelemetry::{KeyValue, propagation::Extractor, global::get_text_map_propagator};
		use opentelemetry_otlp::{new_pipeline, new_exporter, WithExportConfig};
		use opentelemetry_sdk::{
			trace::{Sampler, RandomIdGenerator, Tracer}, Resource, runtime,
			propagation::TraceContextPropagator
		};
		use tracing::{Span, info_span, warn};
		use tracing_opentelemetry::{OpenTelemetryLayer, OpenTelemetrySpanExt};
		use super::getEnv;
		use tracing_subscriber::Registry;
		use axum::{body::Body, http::{Request, HeaderMap}};

		// initTracer creates an OpenTelemetry tracing pipeline and sets the global tracer.
		pub fn initTracer(serviceName: &'static str) -> OpenTelemetryLayer<Registry, Tracer> {
			opentelemetry::global::set_text_map_propagator(TraceContextPropagator::new( ));

			let tracer=
				new_pipeline( )
					.tracing( )
					.with_exporter(
						new_exporter( )
							.tonic( )
							.with_protocol(opentelemetry_otlp::Protocol::Grpc)
							.with_endpoint(getEnv("JAEGER_COLLECTOR_URL"))
							.with_compression(opentelemetry_otlp::Compression::Gzip)
					)
					.with_trace_config(
						opentelemetry_sdk::trace::config( )
							.with_sampler(Sampler::AlwaysOn)
							.with_id_generator(RandomIdGenerator::default( ))
							.with_resource(Resource::new(vec![
								KeyValue::new("service.name", serviceName)
							]))
					)
					.install_batch(runtime::Tokio)
					.expect("ERROR: Creating OpenTelemetry tracing pipeline");

			tracing_opentelemetry::layer( ).with_tracer(tracer)
		}

		pub fn makeSpan(request: &Request<Body>) -> Span {
			let headers= request.headers( );
			info_span!("Incoming Request", ?headers, trace_id = tracing::field::Empty)
		}

		pub fn linkParentTrace(request: Request<Body>) -> Request<Body> {
			let parentCtx= get_text_map_propagator(|propagator| {
				propagator.extract(&MetadataMapExtractor(request.headers( )))
			});
			Span::current( ).set_parent(parentCtx);

			request
		}

		pub struct MetadataMapExtractor<'a>(&'a HeaderMap);

		impl<'a> Extractor for MetadataMapExtractor<'a> {
			fn get(&self, key: &str) -> Option<&str> {
				self.0.get(key).and_then(|v| {
					let s = v.to_str( );

					if let Err(ref error) = s {
						warn!(%error, ?v, "cannot convert header value to ASCII")};

					s.ok( )
				})
			}

			fn keys(&self) -> Vec<&str> {
				self.0.keys( ).map(|k| k.as_str( )).collect( )
			}
		}
	}

  pub const SERVER_ERROR: &'static str= "Server error occurred";

  // toServerError captures any error, logs it and then returns SERVER_ERROR as an anyhow error.
  pub fn toServerError(error: impl std::error::Error) -> anyhow::Error {
    println!("ERROR: {}", error.to_string( ));
    anyhow!(SERVER_ERROR)
  }

	// createConnectionPool creates a PostgreSQL database connection pool.
  pub fn createConnectionPool( ) -> Pool {
		deadpool_postgres::Config {
			host: Some(getEnv("POSTGRES_HOST")),
			port: Some(
				getEnv("POSTGRES_PORT").parse( )
															 .expect("ERROR: parsing env POSTGRES_PORT to u16 type"),
			),
			dbname: Some("instagram_clone".to_string( )),
			user: Some(getEnv("POSTGRES_USER")),
			password: Some(getEnv("POSTGRES_PASSWORD")),

			connect_timeout: Some(Duration::from_secs(5)),

			pool: Some(deadpool_postgres::PoolConfig {
				max_size: getEnv("POSTGRES_CONNECTION_POOL_SIZE").parse( )
																												 .expect("ERROR: parsing env POSTGRES_CONNECTION_POOL_SIZE to u16"),
				..Default::default( )
			}),
			manager: Some(ManagerConfig { recycling_method: RecyclingMethod::Fast }),

			..Default::default( )
		}
			.create_pool(Some(deadpool_postgres::Runtime::Tokio1), NoTls)
			.expect("ERROR: Creating Postgres database connection pool")
	}

	// mapToGrpcError takes an anyhow error, analyses the actual underlying error and returns an
	// appropriate gRPC status code.
	pub fn mapToGrpcError(error: anyhow::Error) -> Status {
		let errorAsString= error.to_string( );

		let grpcErrorCode= {
			if errorAsString.eq(SERVER_ERROR) { Code::Internal }
			else 															{ Code::InvalidArgument }
		};

		Status::new(grpcErrorCode, errorAsString)
	}

	pub mod kafka {
		use anyhow::{Result, anyhow};
		use kafka::consumer::{Consumer, FetchOffset, GroupOffsetStorage};
		use super::debezium::DbEvent;
		use serde::Deserialize;

		pub fn createKafkaConsumer(hosts: Vec<String>, topic: String, group: String) -> Consumer {
			let consumer=
				Consumer::from_hosts(hosts)
									.with_topic(topic.clone( ))
									.with_group(group)
									.with_fallback_offset(FetchOffset::Earliest)
									.with_offset_storage(Some(GroupOffsetStorage::Kafka))
									.create( )
									.expect(&format!("ERROR: Creating Kafka consumer for {} topic", topic));

			println!("INFO: Created Kafka consumer for {} topic", topic);

			consumer
		}

		// extractEventFromMessage takes a message received from the Kafka topic and extracts the db event
		// from it. The extracted event is returned.
		pub fn extractEventFromMessage<T: for<'a> Deserialize<'a>>(

			messageAsBytes: &[u8],
			kafkaTopic: &str

		) -> Result<DbEvent<T>> {
			let messageAsString= String::from_utf8(messageAsBytes.to_vec( ))
																	 .map_err(|error| anyhow!("Error parsing message received from '{}' Kafka topic to 'String' type: {}", kafkaTopic, error))?;

			serde_json::from_str(&messageAsString)
									.map_err(|error| anyhow!("Error de-serializing message received from '{}' Kafka topic: {}", kafkaTopic, error))
		}
	}

	pub mod debezium {
		use std::fmt::{self, Debug};
		use serde::{Deserialize, Deserializer};

		#[derive(Debug)]
		pub enum DbOperation {
			Create,
			Read,
			Update,
			Delete
		}

		impl<'de> Deserialize<'de> for DbOperation {
			fn deserialize<D>(deserializer: D) -> Result<DbOperation, D::Error>
				where D: Deserializer<'de>
			{
				struct DbOperationVisitor;

				impl<'de> serde::de::Visitor<'de> for DbOperationVisitor {
					type Value = DbOperation;

					fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
						formatter.write_str("a string representing a database operation")}

					fn visit_str<E>(self, value: &str) -> Result<DbOperation, E>
						where E: serde::de::Error {

						match value {
							"c" => Ok(DbOperation::Create),
							"r" => Ok(DbOperation::Read),
							"u" => Ok(DbOperation::Update),
							"d" => Ok(DbOperation::Delete),

							_ => Err(E::custom(format!("Invalid value for 'op': {}", value))),
						}
					}
				}

				deserializer.deserialize_str(DbOperationVisitor)
			}
		}

		#[derive(Debug, Deserialize)]
		#[serde(bound = "for<'a> T: Deserialize<'a>")] // The bound indicates that for any lifetime 'a, the
																									// type T must implement the Deserialize trait for
																									// that lifetime. This is a way to express that the
																									// type T is deserializable for any valid lifetime.
		pub struct DbEvent<T>
			// The use of for<'a> in the bound means that the trait implementation is expected to work for any
			// lifetime.
			where for<'a> T: Deserialize<'a> {

			pub payload: DbEventPayload<T>
		}

		#[derive(Debug, Deserialize)]
		pub struct DbEventPayload<T> {
			pub op: DbOperation,

			pub before: Option<T>,
			pub after: Option<T>
		}
	}
}