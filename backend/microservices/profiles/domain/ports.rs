use anyhow::Result;
use async_trait::async_trait;
use serde::Deserialize;
use crate::proto::ProfilePreview;

#[derive(Debug, Deserialize)]
pub struct UserCreatedEvent {
	pub id: usize,
	pub name: String,
	pub username: String
}

#[async_trait]
pub trait ProfilesRepository: Send + Sync {
	async fn create(&self, args: &UserCreatedEvent) -> Result<( )>;

	async fn getProfilePreviews(&self, ids: Vec<i32>) -> Result<Vec<ProfilePreview>>;

	fn cleanup(&self);
}