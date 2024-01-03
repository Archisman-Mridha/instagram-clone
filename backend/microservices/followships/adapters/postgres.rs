use anyhow::{Result, anyhow};
use async_trait::async_trait;
use deadpool_postgres::{Pool, Object};
use shared::{
	utils::{createConnectionPool, toServerError, SERVER_ERROR},
	sql::queries::followships_microservice::{
		create, delete, getFollowshipCounts, getFollowings, getFollowers, exists
	}
};
use crate::{
	domain::ports::FollowshipsRepository,
	proto::{
		GetFollowshipCountsResponse, FollowshipOperationRequest, GetFollowersRequest,
		GetFollowingsRequest, DoesFollowshipExistRequest
	}
};

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
impl FollowshipsRepository for PostgresAdapter {
	// cleanup closes the underlying Postgres database connection pool.
	fn cleanup(&self) {
		self.connectionPool.close( );
		println!("DEBUG: PostgreSQL database connection pool destroyed");
	}

	async fn create(&self, args: &FollowshipOperationRequest) ->  Result<( )> {
		let client= self.getClient( ).await?;

		create( )
			.bind(&client, &args.follower_id, &args.followee_id)
			.await
			// TODO: Send the error to a central log management platform.
			.map_err(toServerError)?;

		Ok(( ))
	}

	async fn delete(&self, args: &FollowshipOperationRequest) ->  Result<( )> {
		let client= self.getClient( ).await?;

		delete( )
			.bind(&client, &args.follower_id, &args.followee_id)
			.await
			// TODO: Send the error to a central log management platform.
			.map_err(toServerError)?;

		Ok(( ))
	}

	async fn exists(&self, args: &DoesFollowshipExistRequest) -> Result<bool> {
		let client= self.getClient( ).await?;

		let result= exists( )
									.bind(&client, &args.follower_id, &args.followee_id)
									.one( )
									.await;

		match result {
			Ok(_) => anyhow::Ok(true),

			Err(error) => {
				if error.to_string( ) == "query returned an unexpected number of rows" {
					return anyhow::Ok(false)}

				Err(anyhow!(SERVER_ERROR))
			}
		}
	}

	async fn getFollowers(&self, args: &GetFollowersRequest) -> Result<Vec<i32>> {
		let client= self.getClient( ).await?;

		getFollowers( )
			.bind(&client, &args.user_id, &args.page_size, &args.offset)
			.all( )
			.await
			// TODO: Send the error to a central log management platform.
			.map_err(toServerError)
	}

	async fn getFollowings(&self, args: &GetFollowingsRequest) -> Result<Vec<i32>> {
		let client= self.getClient( ).await?;

		getFollowings( )
			.bind(&client, &args.user_id, &args.page_size, &args.offset)
			.all( )
			.await
			// TODO: Send the error to a central log management platform.
			.map_err(toServerError)
	}

	async fn getFollowshipCounts(&self, userId: i32) -> Result<GetFollowshipCountsResponse> {
		let client= self.getClient( ).await?;

		let followshipCounts= getFollowshipCounts( )
														.bind(&client, &userId)
														.one( )
														.await
														// TODO: Send the error to a central log management platform.
														.map_err(toServerError)?;

		Ok(GetFollowshipCountsResponse {
			follower_count: followshipCounts.follower_count,
			following_count: followshipCounts.following_count
		})
	}

}