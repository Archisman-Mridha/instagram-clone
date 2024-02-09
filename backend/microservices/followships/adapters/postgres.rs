use crate::{
  domain::ports::FollowshipsRepository,
  proto::{
    DoesFollowshipExistRequest, FollowshipOperationRequest, GetFollowersRequest,
    GetFollowingsRequest, GetFollowshipCountsResponse,
  },
};
use anyhow::{anyhow, Result};
use async_trait::async_trait;
use deadpool_postgres::{Object, Pool};
use shared::{
  sql::queries::followships_microservice::{
    create, delete, exists, getFollowers, getFollowings, getFollowshipCounts,
  },
  utils::{createPgConnectionPool, toServerError, SERVER_ERROR},
};
use tracing::{debug, error, instrument};

pub struct PostgresAdapter {
  connectionPool: Pool,
}

impl PostgresAdapter {
  pub async fn new() -> Self {
    let postgresAdapter = Self {
      connectionPool: createPgConnectionPool(),
    };

    // Get a client from the connection pool to verify that the database is reachable.
    let _ = postgresAdapter
      .connectionPool
      .get()
      .await
      .expect("ERROR: Connecting to the Postgres database");
    debug!("Connected to Postgres database");

    postgresAdapter
  }

  // getClient fetches and returns a database client from the underlying connection pool.
  async fn getClient(&self) -> Result<Object> {
    let client = self.connectionPool.get().await.map_err(toServerError)?;
    Ok(client)
  }
}

#[async_trait]
impl FollowshipsRepository for PostgresAdapter {
  // cleanup closes the underlying Postgres database connection pool.
  fn cleanup(&self) {
    self.connectionPool.close();
    debug!("PostgreSQL database connection pool destroyed");
  }

  #[instrument(skip(self), level = "info")]
  async fn create(&self, args: &FollowshipOperationRequest) -> Result<()> {
    let client = self.getClient().await?;

    create()
      .bind(&client, &args.follower_id, &args.followee_id)
      .await
      .map(|_| ())
      .map_err(toServerError)
  }

  #[instrument(skip(self), level = "info")]
  async fn delete(&self, args: &FollowshipOperationRequest) -> Result<()> {
    let client = self.getClient().await?;

    println!("{:#?}", args);

    delete()
      .bind(&client, &args.follower_id, &args.followee_id)
      .await
      .map(|_| ())
      .map_err(toServerError)
  }

  #[instrument(skip(self), level = "info")]
  async fn exists(&self, args: &DoesFollowshipExistRequest) -> Result<bool> {
    let client = self.getClient().await?;

    let result = exists()
      .bind(&client, &args.follower_id, &args.followee_id)
      .one()
      .await;

    match result {
      Ok(_) => Ok(true),

      Err(error) => {
        if error.to_string() == "query returned an unexpected number of rows" {
          return anyhow::Ok(false);
        }

        error!("{}", error);
        Err(anyhow!(SERVER_ERROR))
      }
    }
  }

  #[instrument(skip(self), level = "info")]
  async fn getFollowers(&self, args: &GetFollowersRequest) -> Result<Vec<i32>> {
    let client = self.getClient().await?;

    getFollowers()
      .bind(&client, &args.user_id, &args.page_size, &args.offset)
      .all()
      .await
      .map_err(toServerError)
  }

  #[instrument(skip(self), level = "info")]
  async fn getFollowings(&self, args: &GetFollowingsRequest) -> Result<Vec<i32>> {
    let client = self.getClient().await?;

    getFollowings()
      .bind(&client, &args.user_id, &args.page_size, &args.offset)
      .all()
      .await
      .map_err(toServerError)
  }

  #[instrument(skip(self), level = "info")]
  async fn getFollowshipCounts(&self, userId: i32) -> Result<GetFollowshipCountsResponse> {
    let client = self.getClient().await?;

    getFollowshipCounts()
      .bind(&client, &userId)
      .one()
      .await
      .map(|value| GetFollowshipCountsResponse {
        follower_count: value.follower_count,
        following_count: value.following_count,
      })
      .map_err(toServerError)
  }
}
