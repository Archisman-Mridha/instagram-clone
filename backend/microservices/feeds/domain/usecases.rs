use crate::proto::GetFeedRequest;
use anyhow::Result;
use derive_more::Constructor;

use super::ports::{FeedsRepository, FollowshipsRepository, PostCreatedEvent};

#[derive(Constructor)]
pub struct Usecases {
  followshipsRepository: &'static dyn FollowshipsRepository,
  feedsRepository: &'static dyn FeedsRepository,
}

impl Usecases {
  pub async fn pushPostToFeeds(&self, postCreatedEvent: PostCreatedEvent) -> Result<()> {
    let followerIds = self
      .followshipsRepository
      .getAllFollowers(postCreatedEvent.ownerId)
      .await?;
    self
      .feedsRepository
      .pushPostToFeeds(followerIds, postCreatedEvent.id)
  }

  pub fn getFeed(&self, args: GetFeedRequest) -> Result<Vec<i32>> {
    self.feedsRepository.getFeed(args)
  }
}
