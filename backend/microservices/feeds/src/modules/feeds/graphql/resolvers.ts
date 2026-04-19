import { UserEntity } from "@instagram-clone/microservices/auth/modules/users/entity"
import { Args } from "@instagram-clone/lib/decorators/args"
import { CurrentUser } from "@instagram-clone/lib/decorators/current-user"
import { Injectable } from "@nestjs/common"
import { QueryBus } from "@nestjs/cqrs"
import { Query, Resolver } from "@nestjs/graphql"
import { GetFeedQuery } from "../queries/get-feed"
import { Feed } from "./models"
import { GetFeedArgs } from "./args"

@Injectable()
@Resolver()
export class FeedsResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => Feed)
  async getFeed(@CurrentUser() user: UserEntity, @Args() args: GetFeedArgs): Promise<Feed> {
    return this.queryBus.execute(new GetFeedQuery({ userID: user.id, ...args }))
  }
}
