use anyhow::Result;
use async_trait::async_trait;

#[async_trait]
pub trait UsersRepository: Sync + Send {
  async fn create<'create>(&self, args: CreateArgs<'create>) -> Result<String>;

  async fn findByEmail(&self, email: &str) -> Result<FindByOutput>;
  async fn findByUsername(&self, username: &str) -> Result<FindByOutput>;
  async fn findById(&self, id: i32) -> Result<FindByOutput>;

  fn cleanup(&self);
}

#[derive(Debug)]
pub struct CreateArgs<'createArgs> {
  pub name: &'createArgs str,
  pub email: &'createArgs str,
  pub username: &'createArgs str,
  pub hashedPassword: &'createArgs str,
}

#[derive(Debug)]
pub struct FindByOutput {
  pub id: String,
  pub hashedPassword: String,
}
