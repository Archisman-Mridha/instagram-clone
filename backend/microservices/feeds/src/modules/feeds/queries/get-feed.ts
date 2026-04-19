import type { RedisClusterType } from "@keyv/redis"
import { REDIS_CLUSTER_CLIENT } from "@instagram-clone/lib/modules/redis/module"
import { PaginatedInput, PaginatedOutput } from "@instagram-clone/lib/utils/pagination"
import { Inject } from "@nestjs/common"
import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"

export interface GetFeedInput extends PaginatedInput {
  userID: number
}

export interface GetFeedOutput extends PaginatedOutput {
  postIDs: Array<number>
}

export class GetFeedQuery extends Query<GetFeedOutput> {
  constructor(readonly input: GetFeedInput) {
    super()
  }
}

@QueryHandler(GetFeedQuery)
export class GetFeedHandler implements IQueryHandler<GetFeedQuery> {
  constructor(
    @Inject(REDIS_CLUSTER_CLIENT)
    private readonly redisClusterClient: RedisClusterType
  ) {}

  async execute({ input }: GetFeedQuery): Promise<GetFeedOutput> {
    const key = `feeds.${input.userID}`

    const [unparsedPostIDs, count] = await Promise.all([
      this.redisClusterClient.lRange(key, input.skip, input.take),
      this.redisClusterClient.lLen(key)
    ])
    const postIDs = unparsedPostIDs.map((postID) => Number(postID))

    return {
      count,
      postIDs
    }
  }
}
