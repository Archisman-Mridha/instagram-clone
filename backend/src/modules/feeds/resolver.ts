import { Injectable } from "@nestjs/common"
import { QueryBus } from "@nestjs/cqrs"
import { Query, Resolver } from "@nestjs/graphql"
import { Feed, GetFeedArgs } from "./dtos"
import { GetFeedQuery } from "./queries/get-feed"
import { Args } from "src/utils/graphql"

@Injectable()
@Resolver()
export class FeedsResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => Feed)
  async getFeed(@Args() args: GetFeedArgs): Promise<Feed> {
    return this.queryBus.execute(new GetFeedQuery(args))
  }
}
