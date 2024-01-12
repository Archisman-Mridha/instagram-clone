use crate::proto::GetFeedRequest;
use anyhow::Result;
use async_trait::async_trait;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct PostCreatedEvent {
  pub id: i32,

  #[serde(rename = "owner_id")]
  pub ownerId: i32,
}

pub trait FeedsRepository: Send + Sync {
  fn pushPostToFeeds(&self, userIds: Vec<i32>, postId: i32) -> Result<()>;

  fn getFeed(&self, args: GetFeedRequest) -> Result<Vec<i32>>;
}

#[async_trait]
pub trait FollowshipsRepository: Send + Sync {
  async fn getAllFollowers(&self, userId: i32) -> Result<Vec<i32>>;

  fn cleanup(&self);
}
