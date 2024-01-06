use anyhow::{Result, anyhow};
use r2d2_redis::{RedisConnectionManager, r2d2::Pool, redis::{pipe, Commands}};
use shared::utils::getEnv;
use crate::{domain::ports::FeedsRepository, proto::GetFeedRequest};
use tracing::instrument;

pub struct RedisAdapter {
	pool: Pool<RedisConnectionManager>
}

impl RedisAdapter {
	pub async fn new( ) -> Self {
		let connectionManager= RedisConnectionManager::new(getEnv("REDIS_URL"))
																									 .expect("Invalid Redis url");

		let pool= Pool::builder( )
										.build(connectionManager)
										.expect("Error creating Redis connection pool");

		println!("INFO: Created Redis connection pool");

		Self { pool }
	}
}

impl FeedsRepository for RedisAdapter {
	#[instrument(skip(self))]
	fn pushPostToFeeds(&self, userIds: Vec<i32>, postId: i32) -> Result<( )> {
		let mut connection= self.pool.get( )
																 .map_err(|error| anyhow!("Error trying to get a connection from the Redis connection pool : {}", error))?;
		let mut pipe= pipe( );

		for userId in userIds {
			pipe.lpush(userId, postId)
				  .ltrim(userId, 0, 1000);
		}

		pipe.query(&mut *connection)
				.map_err(|error| anyhow!("Error execution Redis transaction : {}", error))
	}

	#[instrument(skip(self))]
	fn getFeed(&self, args: GetFeedRequest) -> Result<Vec<i32>> {
		let mut connection= self.pool.get( )
																 .map_err(|error| anyhow!("Error trying to get a connection from the Redis connection pool : {}", error))?;

		let result: Vec<i32>= connection.lrange(args.user_id,
																						args.offset as isize, (args.offset + args.page_size) as isize)?;

		Ok(result)
	}
}