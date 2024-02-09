use crate::{
  domain::ports::{ProfilesRepository, UserCreatedEvent},
  proto::ProfilePreview,
};
use anyhow::{anyhow, Result};
use async_trait::async_trait;
use cornucopia_async::Params;
use deadpool_postgres::{Object, Pool};
use shared::{
  sql::queries::profiles_microservice::{create, getProfilePreviews, CreateParams},
  utils::{createPgConnectionPool, toServerError},
};
use tracing::{debug, error, info, instrument};

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
impl ProfilesRepository for PostgresAdapter {
  // cleanup closes the underlying Postgres database connection pool.
  fn cleanup(&self) {
    self.connectionPool.close();
    debug!("PostgreSQL database connection pool destroyed");
  }

  #[instrument(skip(self), level = "info")]
  async fn create(&self, args: &UserCreatedEvent) -> Result<()> {
    let client = self.getClient().await?;

    let createParams = &CreateParams {
      id: args.id as i32,
      name: args.name.clone(),
      username: args.username.clone(),
    };
    let result = create().params(&client, createParams).await;

    match result {
      Ok(id) => {
        info!(
          "New profile created with id {} and details : {:?}",
          id, args
        );
        Ok(())
      }

      Err(error) => {
        let error = error.to_string();

        if error == "duplicate key value violates unique constraint \"profiles_pkey\"" {
          return Ok(());
        }

        error!(error);
        Err(anyhow!(error))
      }
    }
  }

  #[instrument(skip(self), level = "info")]
  async fn getProfilePreviews(&self, ids: Vec<i32>) -> Result<Vec<ProfilePreview>> {
    let client = self.getClient().await?;

    Ok(
      getProfilePreviews()
        .bind(&client, &ids)
        .all()
        .await
        .map_err(toServerError)?
        .iter()
        .enumerate()
        .map(|(index, value)| ProfilePreview {
          id: ids[index],

          name: value.name.to_owned(),
          username: value.username.to_owned(),
        })
        .collect(),
    )
  }
}
