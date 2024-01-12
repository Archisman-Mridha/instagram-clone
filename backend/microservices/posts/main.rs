#![allow(non_snake_case)]

mod adapters;
mod domain;
mod proto {
  // Including code generated from the .proto files.

  tonic::include_proto!("posts_microservice");

  pub const FILE_DESCRIPTOR_SET: &[u8] =
    tonic::include_file_descriptor_set!("posts_microservice.descriptor");
}

use crate::domain::ports::PostsRepository;
use adapters::{GrpcAdapter, PostgresAdapter};
use domain::usecases::Usecases;
use lazy_static::lazy_static;
use shared::utils::{getEnv, observability::setupObservability};
use std::process::exit;
use tokio::signal;
use tokio_util::sync::CancellationToken;
use tracing::{error, warn};

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
async fn main() {
  let _ = dotenv::from_filename("./backend/microservices/posts/.env");

  setupObservability("posts-microservice");

  let postgresAdapter =
    Box::leak::<'static>(Box::new(PostgresAdapter::new().await)) as &'static PostgresAdapter;

  let usecases = Box::new(Usecases::new(postgresAdapter));

  GrpcAdapter::startServer(usecases).await;

  /* Gracefully shutdown on receiving program shutdown signal. */
  {
    let error = signal::ctrl_c().await.err();
    warn!("Received program shutdown signal");

    let _ = &THREAD_CANCELLATION_TOKEN.cancel(); // Do cleanup tasks in currently active Tokio
                                                 // threads.
    postgresAdapter.cleanup();

    match error {
      None => exit(0),

      Some(error) => {
        error!("{}", error);
        exit(1);
      }
    }
  }
}
