#![allow(non_snake_case)]

mod adapters;
mod proto {
  // Including code generated from the .proto files.

  tonic::include_proto!("users_microservice");

  pub const FILE_DESCRIPTOR_SET: &[u8]=
    tonic::include_file_descriptor_set!("users_microservice.descriptor");
}

use std::{process::exit, env};
use adapters::GrpcAdapter;
use lazy_static::lazy_static;
use tokio::signal;
use tokio_util::sync::CancellationToken;

struct Config {
  GRPC_SERVER_PORT: String,
}

fn getEnv(name: &str) -> String {
	env::var(name).expect(&format!("ERROR: Getting env {}", name))}

// Each value inside is initialized (in a thread safe manner) on the heap, when accessed for the
// first time.
// Read more about lazy_static here - https://blog.logrocket.com/rust-lazy-static-pattern/
lazy_static! {
	static ref CONFIG: Config= Config {
    GRPC_SERVER_PORT: getEnv("GRPC_SERVER_PORT")
  };

  // This cancellation token will be activated when the program receives a shutdown signal. It will
  // trigger cleanup tasks in active Tokio threads.
  static ref THREAD_CANCELLATION_TOKEN: CancellationToken= CancellationToken::new( );
}

const SERVER_ERROR: &'static str= "Server error occurred";

// Under the hood, Tokio creates a runtime which manages threads and IO resources. It submits the
// future representing your main function to the tokio runtime executor. The tokio executor calls
// the poll method on that future.
#[tokio::main] // By default, Tokio will spawn a separate thread to run the Tokio runtime.
async fn main( ) {
	if let Err(error)= dotenv::from_filename("./backend/microservices/users/.env") {
    println!("WARNING: Couldn't load environment variables from .env file due to error : {}", error)}

	GrpcAdapter::startServer( ).await;

	/* Gracefully shutdown on receiving program shutdown signal. */ {
    let error= signal::ctrl_c( ).await.err( );
    println!("WARNING: Received program shutdown signal");

    let _= &THREAD_CANCELLATION_TOKEN.cancel( ); // Do cleanup tasks in currently active Tokio
                                                 // threads.

    match error {
      None => exit(0),

      Some(error) => {
        println!("ERROR: {}", error);
        exit(1);
      }
    }
  }
}