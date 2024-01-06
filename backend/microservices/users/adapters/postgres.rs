use crate::domain::ports::{CreateArgs, FindByOutput, UsersRepository};
use anyhow::{anyhow, Result};
use async_trait::async_trait;
use cornucopia_async::Params;
use deadpool_postgres::{Pool, Object};
use shared::sql::queries::users_microservice::{create, findByEmail, findByUsername, CreateParams, findById};
use shared::utils::{createConnectionPool, SERVER_ERROR, toServerError};
use tracing::instrument;

const EMAIL_ALREADY_REGISTERED_ERROR: &str= "Email is already registered";
const USERNAME_UNAVAILABLE_ERROR: &str= "Username is unavailable";
const USER_NOT_FOUND_ERROR: &str= "User not found";

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
impl UsersRepository for PostgresAdapter {
	// cleanup closes the underlying Postgres database connection pool.
	fn cleanup(&self) {
		self.connectionPool.close( );
		println!("DEBUG: PostgreSQL database connection pool destroyed");
	}

	#[instrument(skip(self))]
  async fn create<'create>(&self, args: CreateArgs<'create>) -> Result<String> {
    let client= self.getClient( ).await?;

    let result=
			create( )
			.params(&client, &CreateParams {
				name: args.name,
				email: args.email,
				username: args.username,
				password: args.hashedPassword,
			})
			.one( ).await;

    result.map(|id| id.to_string( )).map_err(|error| {
      let error= error.to_string( );

      let errorMessage: &str= {
        if !error.contains("duplicate key value violates unique constraint") {
					// TODO: Send the error to a central log management platform.
					SERVER_ERROR
				}

				// CASE: Duplicate email
				else if error.contains("users_email_key") { EMAIL_ALREADY_REGISTERED_ERROR }

				// CASE: Duplicate username
				else { USERNAME_UNAVAILABLE_ERROR }
      };
      anyhow!(errorMessage)
    })
  }

	#[instrument(skip(self))]
  async fn findByEmail(&self, email: &str) -> Result<FindByOutput> {
    let client= self.getClient( ).await?;

    let result= findByEmail( ).bind(&client, &email).one( ).await;

    result
      .map(|value| FindByOutput {
        id: value.id.to_string( ),
        hashedPassword: value.password.to_string( ),
      })
      .map_err(|error| {
        anyhow!({
          if error.to_string( ) == "query returned an unexpected number of rows" { USER_NOT_FOUND_ERROR }

					else {
						// TODO: Send the error to a central log management platform.
						SERVER_ERROR
					}
        })
      })
  }

	#[instrument(skip(self))]
  async fn findByUsername(&self, username: &str) -> Result<FindByOutput> {
    let client= self.getClient( ).await?;

    let result= findByUsername( ).bind(&client, &username).one( ).await;

    result
      .map(|value| FindByOutput {
        id: value.id.to_string( ),
        hashedPassword: value.password.to_string( ),
      })
      .map_err(|error| {
        anyhow!({
          if error.to_string( ) == "query returned an unexpected number of rows" { USER_NOT_FOUND_ERROR }

					else {
						// TODO: Send the error to a central log management platform.
						SERVER_ERROR
					}
        })
      })
  }

	#[instrument(skip(self))]
	async fn findById(&self, id: i32) -> Result<FindByOutput> {
		let client= self.getClient( ).await?;

    let result= findById( ).bind(&client, &id).one( ).await;

    result
      .map(|value| FindByOutput {
        id: value.id.to_string( ),
        hashedPassword: value.password.to_string( ),
      })
      .map_err(|error| {
        anyhow!({
          if error.to_string( ) == "query returned an unexpected number of rows" { USER_NOT_FOUND_ERROR }

					else {
						// TODO: Send the error to a central log management platform.
						SERVER_ERROR
					}
        })
      })
	}
}