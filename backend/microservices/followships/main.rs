#![allow(non_snake_case)]

mod domain;
mod adapters;
mod proto {
  // Including code generated from the .proto files.

  tonic::include_proto!("followships_microservice");

  pub const FILE_DESCRIPTOR_SET: &[u8]=
    tonic::include_file_descriptor_set!("followships_microservice.descriptor");
}

use std::process::exit;
use adapters::{PostgresAdapter, GrpcAdapter};
use domain::usecases::Usecases;
use lazy_static::lazy_static;
use shared::utils::{getEnv, initMetricsServer, distributedTracing::initTracer};
use tokio::signal;
use tokio_util::sync::CancellationToken;
use tracing::subscriber::set_global_default;
use tracing_subscriber::{Registry, layer::SubscriberExt};
use crate::domain::ports::FollowshipsRepository;

pub struct Config {
  GRPC_SERVER_PORT: String,
}

lazy_static! {
  pub static ref CONFIG: Config= Config {
    GRPC_SERVER_PORT: getEnv("GRPC_SERVER_PORT")
  };

  pub static ref THREAD_CANCELLATION_TOKEN: CancellationToken= CancellationToken::new( );
}

#[tokio::main]
async fn main( ) {
	if let Err(error)= dotenv::from_filename("./backend/microservices/followships/.env") {
    println!("WARNING: couldn't load environment variables from .env file due to error : {}", error)}

	// Metrics Monitoring
	initMetricsServer( );
	//
	// Distributed Tracing
	let tracingLayer= initTracer("followships-microservice");

	let registry= Registry::default( ).with(tracingLayer);
	set_global_default(registry).unwrap( );

  let postgresAdapter=
    Box::leak::<'static>(Box::new(PostgresAdapter::new( ).await)) as &'static PostgresAdapter;

	let usecases= Box::new(Usecases::new(postgresAdapter));

	GrpcAdapter::startServer(usecases).await;

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