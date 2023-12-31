use anyhow::{Result, anyhow, Ok};
use async_trait::async_trait;
use cornucopia_async::Params;
use deadpool_postgres::{Object, Pool};
use shared::{
	utils::{createConnectionPool, toServerError, SERVER_ERROR},
	sql::queries::profiles_microservice::{CreateParams, create, getProfilePreviews}
};
use crate::{domain::ports::{ProfilesRepository, UserCreatedEvent}, proto::ProfilePreview};

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
impl ProfilesRepository for PostgresAdapter {
	// cleanup closes the underlying Postgres database connection pool.
	fn cleanup(&self) {
		self.connectionPool.close( );
		println!("DEBUG: PostgreSQL database connection pool destroyed");
	}

	async fn create(&self, args: &UserCreatedEvent) -> Result<( )> {
		let client= self.getClient( ).await?;

    let createParams= &CreateParams {
			id: args.id as i32,
      name: args.name.clone( ),
      username: args.username.clone( )
    };
    let result= create( ).params(&client, createParams).await;

    match result {
			Err(error) => {
				let error= error.to_string( );

				if error == "duplicate key value violates unique constraint \"profiles_pkey\"" {
					return Ok(( ))}

				// TODO: Send the error to a central log management platform.
				Err(anyhow!(SERVER_ERROR))
			},

			_ => Ok(( ))
		}
	}

	async fn getProfilePreviews(&self, ids: Vec<i32>) -> Result<Vec<ProfilePreview>> {
		let client= self.getClient( ).await?;

		Ok(
			getProfilePreviews( ).bind(&client, &ids).all( )
				.await.map_err(toServerError)? // TODO: Send the error to a central log management platform.
				.iter( ).enumerate( ).map(|(index, value)| {
					ProfilePreview {
						id: ids[index],

						name: value.name.to_owned( ),
						username: value.username.to_owned( )
					}
				})
				.collect( )
		)
	}
}