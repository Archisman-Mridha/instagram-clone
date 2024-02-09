use crate::{domain::ports::FeedsRepository, proto::GetFeedRequest};
use anyhow::Result;
use r2d2_redis::{
  r2d2::Pool,
  redis::{pipe, Commands},
  RedisConnectionManager,
};
use shared::utils::{getEnv, toServerError};
use tracing::{debug, instrument};

pub struct RedisAdapter {
  pool: Pool<RedisConnectionManager>,
}

impl RedisAdapter {
  pub async fn new() -> Self {
    let connectionManager =
      RedisConnectionManager::new(getEnv("REDIS_URL")).expect("ERROR : Invalid Redis url");
    let pool = Pool::builder()
      .build(connectionManager)
      .expect("ERROR : Creating Redis connection pool");

    debug!("Created Redis connection pool");

    Self { pool }
  }
}

impl FeedsRepository for RedisAdapter {
  #[instrument(skip(self), level = "info")]
  fn pushPostToFeeds(&self, userIds: Vec<i32>, postId: i32) -> Result<()> {
    let mut connection = self.pool.get().map_err(toServerError)?;
    let mut pipe = pipe();

    for userId in userIds {
      pipe.lpush(userId, postId);
    }

    pipe.query(&mut *connection).map_err(toServerError)
  }

  #[instrument(skip(self), level = "info")]
  fn getFeed(&self, args: GetFeedRequest) -> Result<Vec<i32>> {
    let mut connection = self.pool.get().map_err(toServerError)?;

    connection
      .lrange(
        args.user_id,
        args.offset as isize,
        (args.offset + args.page_size - 1) as isize,
      )
      .map_err(toServerError)
  }
}
