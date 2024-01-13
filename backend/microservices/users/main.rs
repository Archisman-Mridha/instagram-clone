#![allow(non_snake_case)]

mod adapters;
mod domain;
mod utils;
mod proto {
  // Including code generated from the .proto files.

  tonic::include_proto!("users_microservice");

  pub const FILE_DESCRIPTOR_SET: &[u8] =
    tonic::include_file_descriptor_set!("users_microservice.descriptor");
}

use crate::domain::ports::UsersRepository;
use adapters::{GrpcAdapter, PostgresAdapter};
use domain::usecases::Usecases;
use lazy_static::lazy_static;
use opentelemetry::global;
use shared::utils::{getEnv, observability::setupObservability};
use std::process::exit;
use tokio::signal;
use tokio_util::sync::CancellationToken;
use tracing::{error, warn};

struct Config {
  JWT_SECRET: String,
  GRPC_SERVER_PORT: String,
}

// Each value inside is initialized (in a thread safe manner) on the heap, when accessed for the
// first time.
// Read more about lazy_static here - https://blog.logrocket.com/rust-lazy-static-pattern/
lazy_static! {
  static ref CONFIG: Config= Config {
    JWT_SECRET: getEnv("JWT_SECRET"),
    GRPC_SERVER_PORT: getEnv("GRPC_SERVER_PORT")
  };

  // This cancellation token will be activated when the program receives a shutdown signal. It will
  // trigger cleanup tasks in active Tokio threads.
  static ref THREAD_CANCELLATION_TOKEN: CancellationToken= CancellationToken::new( );
}

// Under the hood, Tokio creates a runtime which manages threads and IO resources. It submits the
// future representing your main function to the tokio runtime executor. The tokio executor calls
// the poll method on that future.
#[tokio::main] // By default, Tokio will spawn a separate thread to run the Tokio runtime.
async fn main() {
  // Load environment variables from a .env file, during development process.
  let _ = dotenv::from_filename("./backend/microservices/users/.env");

  setupObservability("users-microservice");

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
    global::shutdown_tracer_provider();

    match error {
      None => exit(0),

      Some(error) => {
        error!("{}", error);
        exit(1);
      }
    }
  }
}
