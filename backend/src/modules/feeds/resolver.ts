import { Injectable } from "@nestjs/common"
import { QueryBus } from "@nestjs/cqrs"
import { Query, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/decorators/current-user"
import { Args } from "src/utils/graphql"
import { UserEntity } from "../users/entity"
import { Feed, GetFeedArgs } from "./dtos"
import { GetFeedQuery } from "./queries/get-feed"

@Injectable()
@Resolver()
export class FeedsResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => Feed)
  async getFeed(@CurrentUser() user: UserEntity, @Args() args: GetFeedArgs): Promise<Feed> {
    return this.queryBus.execute(new GetFeedQuery({ userID: user.id, ...args }))
  }
}
