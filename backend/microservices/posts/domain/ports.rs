use anyhow::Result;
use async_trait::async_trait;
use crate::proto::{CreatePostRequest, GetPostsOfUserRequest, Post};

#[async_trait]
pub trait PostsRepository: Sync + Send {

	async fn create(&self, args: &CreatePostRequest) -> Result<i32>;

	async fn getPostsOfUser(&self, args: &GetPostsOfUserRequest) -> Result<Vec<Post>>;

	fn cleanup(&self);
}