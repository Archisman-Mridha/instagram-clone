use anyhow::Result;
use async_trait::async_trait;
use deadpool_postgres::{Pool, Object};
use shared::{
	utils::{createConnectionPool, toServerError},
	sql::queries::feeds_microservice::getAllFollowers
};
use tracing::instrument;
use crate::domain::ports::FollowshipsRepository;

pub struct PostgresAdapter {
	connectionPool: Pool
}

impl PostgresAdapter {
	pub async fn new( ) -> Self {
		let postgresAdapter= Self { connectionPool: createConnectionPool( )};

		// Get a client from the connection pool to verify that the database is reachable.
		let _= postgresAdapter.connectionPool.get( )
																					.await.expect("ERROR: Connecting to the Postgres database");
		println!("DEBUG: Connected to Postgres database");

		postgresAdapter
	}

	// getClient fetches and returns a database client from the underlying connection pool.
	async fn getClient(&self) -> Result<Object> {
		let client= self.connectionPool.get( ).await.map_err(toServerError)?;
		Ok(client)
	}
}

#[async_trait]
impl FollowshipsRepository for PostgresAdapter {
	// cleanup closes the underlying Postgres database connection pool.
	fn cleanup(&self) {
		self.connectionPool.close( );
		println!("DEBUG: PostgreSQL database connection pool destroyed");
	}

	#[instrument(skip(self))]
	async fn getAllFollowers(&self, userId: i32) -> Result<Vec<i32>> {
		let client= self.getClient( ).await?;

		getAllFollowers( )
			.bind(&client, &userId)
			.all( )
			.await
			// TODO: Send the error to a central log management platform.
			.map_err(toServerError)
	}
}