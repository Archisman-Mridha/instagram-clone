use anyhow::{Result, Ok};
use async_trait::async_trait;
use deadpool_postgres::{Pool, Object};
use shared::{
	utils::{createConnectionPool, toServerError},
	sql::queries::posts_microservice::{create, getPostsOfUser, getPosts}
};
use crate::{domain::ports::PostsRepository, proto::{CreatePostRequest, Post, GetPostsOfUserRequest}};
use tracing::instrument;

pub struct PostgresAdapter {
	connectionPool: Pool
}

impl PostgresAdapter {
	pub async fn new( ) -> Self {
		let postgresAdapter= Self {
			connectionPool: createConnectionPool( )
		};

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
impl PostsRepository for PostgresAdapter {
	// cleanup closes the underlying Postgres database connection pool.
	fn cleanup(&self) {
		self.connectionPool.close( );
		println!("DEBUG: PostgreSQL database connection pool destroyed");
	}

	#[instrument(skip(self))]
	async fn create(&self, args: &CreatePostRequest) -> Result<i32> {
		let client= self.getClient( ).await?;

    create( )
			.bind(&client, &args.owner_id, &args.description)
			.one( )
			.await
			// TODO: Send the error to a central log management platform.
      .map_err(toServerError)
	}

	#[instrument(skip(self))]
	async fn getPostsOfUser(&self, args: &GetPostsOfUserRequest) -> Result<Vec<Post>> {
		let client= self.getClient( ).await?;

		Ok(
			getPostsOfUser( )
				.bind(&client, &args.owner_id, &args.page_size, &args.offset)
				.all( )
				.await.map_err(toServerError)? // TODO: Send the error to a central log management platform.
				.iter( ).map(|value| {
					Post {
						id: value.id,
						owner_id: args.owner_id,

						description: value.description.to_owned( ),
						created_at: value.created_at.to_string( )
					}
				})
				.collect( )
		)
	}

	#[instrument(skip(self))]
	async fn getPosts(&self, postIds: Vec<i32>) -> Result<Vec<Post>> {
		let client= self.getClient( ).await?;

		Ok(
			getPosts( )
				.bind(&client, &postIds)
				.all( )
				.await.map_err(toServerError)? // TODO: Send the error to a central log management platform.
				.iter( ).map(|value| {
					Post {
						id: value.id,
						owner_id: value.owner_id,

						description: value.description.to_owned( ),
						created_at: value.created_at.to_string( )
					}
				})
				.collect( )
		)
	}
}