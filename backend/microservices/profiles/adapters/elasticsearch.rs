use std::{str::{from_utf8, FromStr}, fmt::Debug};
use anyhow::{Result, anyhow};
use elasticsearch::{
	Elasticsearch,
	http::{Url, transport::{TransportBuilder, SingleNodeConnectionPool}, response::Response},
	auth::Credentials
};
use serde_json::json;
use shared::utils::{getEnv, SERVER_ERROR};
use crate::{CONFIG, domain::ports::UserCreatedEvent, proto::ProfilePreview};
use serde::{Serialize, Deserialize};

const ELASTICSEARCH_PROFILES_INDEX: &str= "profiles";

#[derive(Serialize)]
struct ProfilesIndexBody<'profilesIndexBody> {
	name: &'profilesIndexBody str,
	username: &'profilesIndexBody str
}

pub struct ElasticsearchAdapter {
	client: Elasticsearch
}

impl ElasticsearchAdapter {
	pub async fn new( ) -> Self {
		let url= Url::from_str(&CONFIG.ELASTICSEARCH_URL)
										.expect("ERROR: Invalid Elasticsearch URL");
		let credentials= Credentials::Basic(getEnv("ELASTICSEARCH_USERNAME"), getEnv("ELASTICSEARCH_PASSWORD"));

		let transport= TransportBuilder::new(SingleNodeConnectionPool::new(url))
																			.auth(credentials)
																			.disable_proxy( )
																			.build( ).expect("ERROR: Creating HTTP transport for ElasticsearchAdapter");
		let client= Elasticsearch::new(transport);

		client.ping( ).send( ).await
					.expect("ERROR: Connecting to Elasticsearch");

		println!("DEBUG: Connected to Elasticsearch");

		Self { client }
	}

	pub async fn indexProfile(&self, args: UserCreatedEvent) -> Result<( )> {
		let id= &args.id.to_string( );

		self.client
			.index(elasticsearch::IndexParts::IndexId(ELASTICSEARCH_PROFILES_INDEX, id))
			.body(
				json!({
					"name": &args.name,
					"username": &args.username
				})
			)
			.send( ).await
			// TODO: Send the error to a central log management platform.
			.map_err(|_| anyhow!(SERVER_ERROR))?;

    Ok(( ))
	}

	pub async fn searchProfiles(&self, query: &str) -> Result<Vec<ProfilePreview>> {
		let response=
			self.client
				.search(elasticsearch::SearchParts::Index(&[ ELASTICSEARCH_PROFILES_INDEX ]))
				.body(
					json!({
						"query": {
							"multi_match": {
								"query": query,
								"type": "phrase_prefix",
								"fields": ["name", "username"]
							}
						}
					})
				)
				.send( ).await
				// TODO: Send the error to a central log management platform.
				.map_err(|_| anyhow!(SERVER_ERROR))?;

		deserializeQueryProfilesResponse(response).await
			// TODO: Send the error to a central log management platform.
			.map_err(|_| anyhow!(SERVER_ERROR))
	}
}

// deserializeQueryProfilesResponse takes in the response returned from Elasticsearch for the query
// done in ElasticsearchAdapter.searchProfiles and tries to deserialize it to Vec<ProfilePreview>.
async fn deserializeQueryProfilesResponse(response: Response) -> Result<Vec<ProfilePreview>> {

	#[derive(Deserialize)]
	struct Response {
		hits: Hits
	}

	#[derive(Deserialize)]
	struct Hits {
		hits: Vec<Hit>
	}

	#[derive(Deserialize)]
	struct Hit {
		_id: String,
		_source: Source
	}

	#[derive(Deserialize, Debug)]
	struct Source {
		name: String,
		username: String
	}

	let response= response.bytes( ).await?.to_vec( );
	let response= from_utf8(&response)?;

	let response: Response= serde_json::from_str(response).unwrap( );

	let profiles=
		response.hits.hits.iter( )
			.map(|hit| {
				let id: i32= hit._id.parse( ).unwrap( );

				ProfilePreview {
					id: id,
					name: hit._source.name.clone( ),
					username: hit._source.username.clone( )
				}
			})
			.collect( );
	Ok(profiles)
}