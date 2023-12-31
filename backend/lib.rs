#![allow(non_snake_case)]

pub mod sql;

pub mod utils {
	use anyhow::anyhow;
  use deadpool_postgres::{ManagerConfig, Pool, RecyclingMethod};
	use tonic::{Status, Code};
  use std::{env, time::Duration};
  use tokio_postgres::NoTls;

	pub fn getEnv(name: &str) -> String {
    env::var(name).expect(&format!("ERROR: Getting env {}", name))}

  pub const SERVER_ERROR: &'static str= "Server error occurred";

  // toServerError captures any error, logs it and then returns SERVER_ERROR as an anyhow error.
  pub fn toServerError(error: impl std::error::Error) -> anyhow::Error {
    println!("ERROR: {}", error.to_string( ));
    anyhow!(SERVER_ERROR)
  }

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
}