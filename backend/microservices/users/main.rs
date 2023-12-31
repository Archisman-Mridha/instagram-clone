#![allow(non_snake_case)]

mod adapters;
mod proto {
  // Including code generated from the .proto files.

  tonic::include_proto!("users_microservice");

  pub const FILE_DESCRIPTOR_SET: &[u8]=
    tonic::include_file_descriptor_set!("users_microservice.descriptor");
}

use std::process::exit;
use adapters::GrpcAdapter;
use lazy_static::lazy_static;
use tokio::signal;
use tokio_util::sync::CancellationToken;

// Each value inside is initialized (in a thread safe manner) on the heap, when accessed for the
// first time.
// Read more about lazy_static here - https://blog.logrocket.com/rust-lazy-static-pattern/
lazy_static! {
  // This cancellation token will be activated when the program receives a shutdown signal. It will
  // trigger cleanup tasks in active Tokio threads.
  pub static ref THREAD_CANCELLATION_TOKEN: CancellationToken= CancellationToken::new( );
}

const SERVER_ERROR: &'static str= "Server error occurred";

// Under the hood, Tokio creates a runtime which manages threads and IO resources. It submits the
// future representing your main function to the tokio runtime executor. The tokio executor calls
// the poll method on that future.
#[tokio::main] // By default, Tokio will spawn a separate thread to run the Tokio runtime.
async fn main( ) {
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