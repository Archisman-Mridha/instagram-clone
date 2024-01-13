#![allow(non_snake_case)]

mod adapters;
mod domain;
mod proto {
  // Including code generated from the .proto files.

  tonic::include_proto!("feeds_microservice");

  pub const FILE_DESCRIPTOR_SET: &[u8] =
    tonic::include_file_descriptor_set!("feeds_microservice.descriptor");
}

use crate::domain::ports::FollowshipsRepository;
use adapters::{GrpcAdapter, PostgresAdapter, RedisAdapter};
use domain::usecases::Usecases;
use lazy_static::lazy_static;
use shared::utils::{getEnv, observability::setupObservability};
use std::process::exit;
use tokio::{signal, spawn};
use tokio_util::sync::CancellationToken;
use tracing::{error, warn};

struct Config {
  GRPC_SERVER_PORT: String,
  KAFKA_HOSTS: String,
}

lazy_static! {
  static ref CONFIG: Config = Config {
    GRPC_SERVER_PORT: getEnv("GRPC_SERVER_PORT"),
    KAFKA_HOSTS: getEnv("KAFKA_HOSTS")
  };
  static ref THREAD_CANCELLATION_TOKEN: CancellationToken = CancellationToken::new();
}

#[tokio::main]
async fn main() {
  let _ = dotenv::from_filename("./backend/microservices/feeds/.env");

  setupObservability("feeds-microservice");

  let postgresAdapter =
    Box::leak::<'static>(Box::new(PostgresAdapter::new().await)) as &'static PostgresAdapter;

  let redisAdapter =
    Box::leak::<'static>(Box::new(RedisAdapter::new().await)) as &'static RedisAdapter;

  let usecases = Box::leak::<'static>(Box::new(Usecases::new(postgresAdapter, redisAdapter)));

  spawn(async {
    let mut kafkaAdapter = adapters::KafkaAdapter::new();
    kafkaAdapter.consume(usecases).await;
  });

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
