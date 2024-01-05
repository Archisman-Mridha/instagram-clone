#![allow(non_snake_case)]

mod domain;
mod adapters;
mod proto {
  // Including code generated from the .proto files.

  tonic::include_proto!("posts_microservice");

  pub const FILE_DESCRIPTOR_SET: &[u8]=
    tonic::include_file_descriptor_set!("posts_microservice.descriptor");
}

use std::process::exit;
use adapters::{PostgresAdapter, GrpcAdapter};
use domain::usecases::Usecases;
use lazy_static::lazy_static;
use shared::utils::{getEnv, initMetricsServer};
use tokio::signal;
use tokio_util::sync::CancellationToken;
use crate::domain::ports::PostsRepository;

pub struct Config {
  GRPC_SERVER_PORT: String,
}

lazy_static! {
  // This value is initialized (in a thread safe manner) on the heap, when it is accessed for the
  // first time.
  // Read more about lazy_static here - https://blog.logrocket.com/rust-lazy-static-pattern/
  pub static ref CONFIG: Config= Config {
    GRPC_SERVER_PORT: getEnv("GRPC_SERVER_PORT")
  };

  // This cancellation token will be activated when the program receives a shutdown signal. It will
  // trigger cleanup tasks in active Tokio threads.
  pub static ref THREAD_CANCELLATION_TOKEN: CancellationToken= CancellationToken::new( );
}

#[tokio::main]
async fn main( ) {
	if let Err(error)= dotenv::from_filename("./backend/microservices/posts/.env") {
    println!("WARNING: couldn't load environment variables from .env file due to error : {}", error)}

	initMetricsServer( );

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