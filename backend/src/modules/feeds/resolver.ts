import { Injectable } from "@nestjs/common"
import { QueryBus } from "@nestjs/cqrs"
import { Query, Resolver } from "@nestjs/graphql"
import { Input } from "src/utils/graphql"
import { GetPostsByIDsQuery } from "../posts/queries/get-posts-by-ids"
import { GetFeedRequestBody, GetFeedResponseBody } from "./dtos"
import { GetFeedQuery } from "./queries/get-feed"

@Injectable()
@Resolver()
export class FeedsResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => GetFeedResponseBody)
  async getFeed(@Input() input: GetFeedRequestBody): Promise<GetFeedResponseBody> {
    const { postIDs } = await this.queryBus.execute(new GetFeedQuery(input))

    const { posts } = await this.queryBus.execute(new GetPostsByIDsQuery({ ids: postIDs }))

    return {
      count: posts.length,
      posts
    }
  }
}
