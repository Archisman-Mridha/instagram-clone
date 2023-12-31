#![allow(non_snake_case)]

mod domain;
mod adapters;
mod proto {
  // Including code generated from the .proto files.

  tonic::include_proto!("profiles_microservice");

  pub const FILE_DESCRIPTOR_SET: &[u8]=
    tonic::include_file_descriptor_set!("profiles_microservice.descriptor");
}

use std::process::exit;
use adapters::{PostgresAdapter, GrpcAdapter, ElasticsearchAdapter};
use domain::usecases::Usecases;
use lazy_static::lazy_static;
use shared::utils::getEnv;
use tokio::{signal, spawn};
use tokio_util::sync::CancellationToken;
use crate::domain::ports::ProfilesRepository;

struct Config {
	ELASTICSEARCH_URL: String,
  GRPC_SERVER_PORT: String,
	KAFKA_HOSTS: String
}

lazy_static! {
  static ref CONFIG: Config= Config {
		ELASTICSEARCH_URL: getEnv("ELASTICSEARCH_URL"),
    GRPC_SERVER_PORT: getEnv("GRPC_SERVER_PORT"),
		KAFKA_HOSTS: getEnv("KAFKA_HOSTS")
  };

  static ref THREAD_CANCELLATION_TOKEN: CancellationToken= CancellationToken::new( );
}

#[tokio::main]
async fn main( ) {
	// Load environment variables from a .env file, during development process.
  if let Err(error)= dotenv::from_filename("./backend/microservices/profiles/.env") {
    println!("WARNING: couldn't load environment variables from .env file due to error : {}", error)}

	let postgresAdapter=
		Box::leak::<'static>(Box::new(PostgresAdapter::new( ).await)) as &'static PostgresAdapter;

	let elasticsearchAdapter= ElasticsearchAdapter::new( ).await;

	let usecases= Box::leak::<'static>(Box::new(Usecases::new(postgresAdapter, elasticsearchAdapter)));

	GrpcAdapter::startServer(usecases).await;

	spawn(async {
		let mut kafkaAdapter= adapters::KafkaAdapter::new( );
		kafkaAdapter.consume(usecases).await;
	});

	/* Gracefully shutdown on receiving program shutdown signal. */ {
    let error= signal::ctrl_c( ).await.err( );
    println!("WARNING: Received program shutdown signal");

    let _= &THREAD_CANCELLATION_TOKEN.cancel( ); // Do cleanup tasks in currently active Tokio
                                                 // threads.
		postgresAdapter.cleanup( );

    match error {
      None => exit(0),

      Some(error) => {
        println!("ERROR: {}", error);
        exit(1);
      }
    }
  }
}