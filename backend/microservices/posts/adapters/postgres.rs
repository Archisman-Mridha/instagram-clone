use crate::{
  domain::ports::PostsRepository,
  proto::{CreatePostRequest, GetPostsOfUserRequest, Post},
};
use anyhow::{Ok, Result};
use async_trait::async_trait;
use deadpool_postgres::{Object, Pool};
use shared::{
  sql::queries::posts_microservice::{create, getPosts, getPostsOfUser},
  utils::{createPgConnectionPool, toServerError},
};
use tracing::{debug, info, instrument};

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
impl PostsRepository for PostgresAdapter {
  // cleanup closes the underlying Postgres database connection pool.
  fn cleanup(&self) {
    self.connectionPool.close();
    debug!("PostgreSQL database connection pool destroyed");
  }

  #[instrument(skip(self), level = "info")]
  async fn create(&self, args: &CreatePostRequest) -> Result<i32> {
    let client = self.getClient().await?;

    create()
      .bind(&client, &args.owner_id, &args.description)
      .one()
      .await
      .map(|id| {
        info!("New post created with id {} and details : {:?}", id, args);
        id
      })
      .map_err(toServerError)
  }

  #[instrument(skip(self), level = "info")]
  async fn getPostsOfUser(&self, args: &GetPostsOfUserRequest) -> Result<Vec<Post>> {
    let client = self.getClient().await?;

    Ok(
      getPostsOfUser()
        .bind(&client, &args.owner_id, &args.page_size, &args.offset)
        .all()
        .await
        .map_err(toServerError)?
        .iter()
        .map(|value| Post {
          id: value.id,
          owner_id: args.owner_id,

          description: value.description.to_owned(),
          created_at: value.created_at.to_string(),
        })
        .collect(),
    )
  }

  #[instrument(skip(self), level = "info")]
  async fn getPosts(&self, postIds: Vec<i32>) -> Result<Vec<Post>> {
    let client = self.getClient().await?;

    Ok(
      getPosts()
        .bind(&client, &postIds)
        .all()
        .await
        .map_err(toServerError)?
        .iter()
        .map(|value| Post {
          id: value.id,
          owner_id: value.owner_id,

          description: value.description.to_owned(),
          created_at: value.created_at.to_string(),
        })
        .collect(),
    )
  }
}
