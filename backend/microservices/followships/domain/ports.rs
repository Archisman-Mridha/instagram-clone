use anyhow::Result;
use async_trait::async_trait;
use crate::proto::{GetFollowshipCountsResponse, GetFollowingsRequest, GetFollowersRequest, FollowshipOperationRequest};

#[async_trait]
pub trait FollowshipsRepository: Send + Sync {

	async fn create(&self, args: &FollowshipOperationRequest) ->  Result<( )>;
	async fn delete(&self, args: &FollowshipOperationRequest) ->  Result<( )>;

	async fn getFollowers(&self, args: &GetFollowersRequest) -> Result<Vec<i32>>;
	async fn getFollowings(&self, args: &GetFollowingsRequest) -> Result<Vec<i32>>;
	async fn getFollowshipCounts(&self, userId: i32) -> Result<GetFollowshipCountsResponse>;

	fn cleanup(&self);
}