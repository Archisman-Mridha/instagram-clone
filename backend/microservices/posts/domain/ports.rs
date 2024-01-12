use crate::proto::{CreatePostRequest, GetPostsOfUserRequest, Post};
use anyhow::Result;
use async_trait::async_trait;

#[async_trait]
pub trait PostsRepository: Sync + Send {
  async fn create(&self, args: &CreatePostRequest) -> Result<i32>;

  async fn getPostsOfUser(&self, args: &GetPostsOfUserRequest) -> Result<Vec<Post>>;
  async fn getPosts(&self, postIds: Vec<i32>) -> Result<Vec<Post>>;

  fn cleanup(&self);
}
