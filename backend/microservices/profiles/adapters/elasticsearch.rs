use crate::{domain::ports::UserCreatedEvent, proto::ProfilePreview, CONFIG};
use anyhow::Result;
use elasticsearch::{
  auth::Credentials,
  http::{
    response::Response,
    transport::{SingleNodeConnectionPool, TransportBuilder},
    Url,
  },
  Elasticsearch,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use shared::utils::{getEnv, toServerError};
use std::{
  fmt::Debug,
  str::{from_utf8, FromStr},
};
use tracing::{debug, error, info, instrument};

const ELASTICSEARCH_PROFILES_INDEX: &str = "profiles";

#[derive(Serialize)]
struct ProfilesIndexBody<'profilesIndexBody> {
  name: &'profilesIndexBody str,
  username: &'profilesIndexBody str,
}

pub struct ElasticsearchAdapter {
  client: Elasticsearch,
}

impl ElasticsearchAdapter {
  pub async fn new() -> Self {
    let url = Url::from_str(&CONFIG.ELASTICSEARCH_URL).expect("ERROR: Invalid Elasticsearch URL");
    let credentials = Credentials::Basic(
      getEnv("ELASTICSEARCH_USERNAME"),
      getEnv("ELASTICSEARCH_PASSWORD"),
    );

    let transport = TransportBuilder::new(SingleNodeConnectionPool::new(url))
      .auth(credentials)
      .disable_proxy()
      .build()
      .expect("ERROR: Creating HTTP transport for ElasticsearchAdapter");
    let client = Elasticsearch::new(transport);

    client
      .ping()
      .send()
      .await
      .expect("ERROR: Connecting to Elasticsearch");

    debug!("Connected to Elasticsearch");

    Self { client }
  }

  #[instrument(skip(self), level = "info")]
  pub async fn indexProfile(&self, args: UserCreatedEvent) -> Result<()> {
    let id = &args.id.to_string();

    self
      .client
      .index(elasticsearch::IndexParts::IndexId(
        ELASTICSEARCH_PROFILES_INDEX,
        id,
      ))
      .body(json!({
        "name": &args.name,
        "username": &args.username
      }))
      .send()
      .await
      .map(|_| info!("Profile indexed in Elasticsearch : {:?}", args))
      .map_err(toServerError)
  }

  #[instrument(skip(self), level = "info")]
  pub async fn searchProfiles(&self, query: &str) -> Result<Vec<ProfilePreview>> {
    let response = self
      .client
      .search(elasticsearch::SearchParts::Index(&[
        ELASTICSEARCH_PROFILES_INDEX,
      ]))
      .body(json!({
        "query": {
          "multi_match": {
            "query": query,
            "type": "phrase_prefix",
            "fields": ["name", "username"]
          }
        }
      }))
      .send()
      .await
      .map_err(toServerError)?;

    deserializeQueryProfilesResponse(response)
      .await
      .map_err(|error| {
        error!("Unexpected server error occurred : {}", error);
        error
      })
  }
}

// deserializeQueryProfilesResponse takes in the response returned from Elasticsearch for the query
// done in ElasticsearchAdapter.searchProfiles and tries to deserialize it to Vec<ProfilePreview>.
async fn deserializeQueryProfilesResponse(response: Response) -> Result<Vec<ProfilePreview>> {
  #[derive(Debug, Deserialize)]
  struct Response {
    hits: Hits,
  }

  #[derive(Debug, Deserialize)]
  struct Hits {
    hits: Vec<Hit>,
  }

  #[derive(Debug, Deserialize)]
  struct Hit {
    _id: String,
    _source: Source,
  }

  #[derive(Deserialize, Debug)]
  struct Source {
    name: String,
    username: String,
  }

  let response = response.bytes().await?.to_vec();
  let response = from_utf8(&response)?;

  let response: Response = serde_json::from_str(response)?;

  let profiles = response
    .hits
    .hits
    .iter()
    .map(|hit| {
      let id: i32 = hit._id.parse().unwrap();

      ProfilePreview {
        id: id,
        name: hit._source.name.clone(),
        username: hit._source.username.clone(),
      }
    })
    .collect();
  Ok(profiles)
}
