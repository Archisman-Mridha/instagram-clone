use anyhow::{Result, Ok};
use async_trait::async_trait;
use deadpool_postgres::{Pool, Object};
use shared::{
	utils::{createConnectionPool, toServerError},
	sql::queries::followships_microservice::{create, delete, getFollowshipCounts, getFollowings, getFollowers}
};
use crate::{domain::ports::FollowshipsRepository, proto::{GetFollowshipCountsResponse, FollowshipOperationRequest, GetFollowersRequest, GetFollowingsRequest}};

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

	async fn getFollowers(&self, args: &GetFollowersRequest) -> Result<Vec<i32>> {
		let client= self.getClient( ).await?;

		let followers= getFollowers( )
										.bind(&client, &args.user_id, &args.page_size, &args.offset)
										.all( )
										.await
										// TODO: Send the error to a central log management platform.
										.map_err(toServerError)?;

		Ok(followers)
	}

	async fn getFollowings(&self, args: &GetFollowingsRequest) -> Result<Vec<i32>> {
		let client= self.getClient( ).await?;

		let followings= getFollowings( )
											.bind(&client, &args.user_id, &args.page_size, &args.offset)
											.all( )
											.await
											// TODO: Send the error to a central log management platform.
											.map_err(toServerError)?;

		Ok(followings)
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