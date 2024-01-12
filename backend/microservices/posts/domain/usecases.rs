use super::ports::PostsRepository;
use crate::proto::{CreatePostRequest, GetPostsOfUserRequest, Post};
use anyhow::Result;
use derive_more::Constructor;

#[derive(Constructor)]
pub struct Usecases {
  postsRepository: &'static dyn PostsRepository,
}

impl Usecases {
  pub async fn createPost(&self, args: CreatePostRequest) -> Result<i32> {
    self.postsRepository.create(&args).await
  }

  pub async fn getPostsOfUser(&self, args: GetPostsOfUserRequest) -> Result<Vec<Post>> {
    self.postsRepository.getPostsOfUser(&args).await
  }

  pub async fn getPosts(&self, postIds: Vec<i32>) -> Result<Vec<Post>> {
    self.postsRepository.getPosts(postIds).await
  }
}
