use crate::{adapters::ElasticsearchAdapter, proto::ProfilePreview};
use anyhow::{Ok, Result};

use super::ports::{ProfilesRepository, UserCreatedEvent};
use derive_more::Constructor;

#[derive(Constructor)]
pub struct Usecases {
  profilesRepository: &'static dyn ProfilesRepository,
  elasticsearchAdapter: ElasticsearchAdapter,
}

impl Usecases {
  pub async fn createProfile(&self, args: UserCreatedEvent) -> Result<()> {
    self.profilesRepository.create(&args).await?;
    self.elasticsearchAdapter.indexProfile(args).await?;

    Ok(())
  }

  pub async fn searchProfiles(&self, query: &str) -> Result<Vec<ProfilePreview>> {
    self.elasticsearchAdapter.searchProfiles(query).await
  }

  pub async fn getProfilePreviews(&self, ids: Vec<i32>) -> Result<Vec<ProfilePreview>> {
    self.profilesRepository.getProfilePreviews(ids).await
  }
}
