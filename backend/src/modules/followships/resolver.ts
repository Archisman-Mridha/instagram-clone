import { QueryBus, CommandBus } from "@nestjs/cqrs"
import { Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/decorators/current-user"
import { Args } from "src/utils/graphql"
import { ProfilePreview } from "../profiles/dtos"
import { GetProfilePreviewByIDQuery } from "../profiles/queries/get-profile-preview-by-id"
import { CreateFollowshipCommand } from "./commands/create-followship"
import { DeleteFollowshipCommand } from "./commands/delete-followship"
import {
  CreateFollowshipArgs,
  DeleteFollowshipArgs,
  Followee,
  Followees,
  Follower,
  Followers,
  GetFolloweesArgs,
  GetFollowersArgs
} from "./dtos"
import { GetFolloweesQuery } from "./queries/get-followees"
import { GetFollowersQuery } from "./queries/get-followers"

@Resolver(() => Follower)
export class FollowerResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @ResolveField(() => ProfilePreview)
  async profilePreview(@Parent() follower: Follower): Promise<ProfilePreview> {
    return this.queryBus.execute(new GetProfilePreviewByIDQuery({ id: follower.id }))
  }
}

@Resolver(() => Followee)
export class FolloweeResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @ResolveField(() => ProfilePreview)
  async profilePreview(@Parent() followee: Followee): Promise<ProfilePreview> {
    return this.queryBus.execute(new GetProfilePreviewByIDQuery({ id: followee.id }))
  }
}

@Resolver()
export class FollowshipsResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Mutation(() => Boolean)
  async follow(
    @CurrentUser() followerID: number,
    @Args() args: CreateFollowshipArgs
  ): Promise<boolean> {
    await this.commandBus.execute(new CreateFollowshipCommand({ followerID, ...args }))

    return true
  }

  @Mutation(() => Boolean)
  async unfollow(
    @CurrentUser() followerID: number,
    @Args() args: DeleteFollowshipArgs
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteFollowshipCommand({ followerID, ...args }))

    return true
  }

  @Query(() => Followers)
  async getFollowers(@Args() args: GetFollowersArgs): Promise<Followers> {
    const { count, followerIDs } = await this.queryBus.execute(new GetFollowersQuery(args))

    const followers = followerIDs.map((followerID) => ({ id: followerID }))

    return {
      count,
      followers
    }
  }

  @Query(() => Followees)
  async getFollowees(@Args() args: GetFolloweesArgs): Promise<Followees> {
    const { count, followeeIDs } = await this.queryBus.execute(new GetFolloweesQuery(args))

    const followees = followeeIDs.map((followeeID) => ({ id: followeeID }))

    return {
      count,
      followees
    }
  }
}
