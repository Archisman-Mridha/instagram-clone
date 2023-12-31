use anyhow::Result;
use derive_more::Constructor;
use crate::proto::*;
use super::ports::FollowshipsRepository;

#[derive(Constructor)]
pub struct Usecases {
	followshipsRepository: &'static dyn FollowshipsRepository
}

impl Usecases {
	pub async fn follow(&self, args: &FollowshipOperationRequest) -> Result<( )> {
		self.followshipsRepository.create(args).await
	}

	pub async fn unfollow(&self, args: &FollowshipOperationRequest) -> Result<( )> {
		self.followshipsRepository.delete(args).await
	}

	pub async fn getFollowers(&self, args: &GetFollowersRequest) -> Result<GetFollowersResponse> {
		self.followshipsRepository.
				getFollowers(args).await
				.map(|followers| GetFollowersResponse { follower_ids: followers })
	}

	pub async fn getFollowings(&self, args: &GetFollowingsRequest) -> Result<GetFollowingsResponse> {
		self.followshipsRepository
				.getFollowings(args).await
				.map(|followings| GetFollowingsResponse { followee_ids: followings })
	}

	pub async fn getFollowshipCounts(&self, userId: i32) -> Result<GetFollowshipCountsResponse> {
		self.followshipsRepository
				.getFollowshipCounts(userId).await
				.map(|followshipCounts| {
					GetFollowshipCountsResponse {
						follower_count: followshipCounts.follower_count,
						following_count: followshipCounts.following_count
					}
				})
	}
}