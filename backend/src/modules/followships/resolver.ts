import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Mutation, Query, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/decorators/current-user"
import { Input } from "src/utils/graphql"
import { GetProfilePreviewsByIDsQuery } from "../profiles/queries/get-profile-previews-by-ids"
import { CreateFollowshipCommand } from "./commands/create-followship"
import { DeleteFollowshipCommand } from "./commands/delete-followship"
import {
  CreateFollowshipRequestBody,
  DeleteFollowshipRequestBody,
  GetFolloweesRequestBody,
  GetFolloweesResponseBody,
  GetFollowersRequestBody,
  GetFollowersResponseBody
} from "./dtos"
import { FollowshipEntity } from "./entity"
import { GetFolloweesQuery } from "./queries/get-followees"
import { GetFollowersQuery } from "./queries/get-followers"

@Resolver(() => FollowshipEntity)
export class FollowshipsResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Mutation(() => Boolean)
  async follow(
    @CurrentUser() followerID: number,
    @Input() input: CreateFollowshipRequestBody
  ): Promise<boolean> {
    await this.commandBus.execute(new CreateFollowshipCommand({ followerID, ...input }))

    return true
  }

  @Mutation(() => Boolean)
  async unfollow(
    @CurrentUser() followerID: number,
    @Input() input: DeleteFollowshipRequestBody
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteFollowshipCommand({ followerID, ...input }))

    return true
  }

  @Query(() => GetFollowersResponseBody)
  async getFollowers(@Input() input: GetFollowersRequestBody): Promise<GetFollowersResponseBody> {
    const { followerIDs } = await this.queryBus.execute(new GetFollowersQuery(input))

    const { profilePreviews: followers } = await this.queryBus.execute(
      new GetProfilePreviewsByIDsQuery({ ids: followerIDs })
    )

    return {
      count: followers.length,
      followers
    }
  }

  @Query(() => GetFolloweesResponseBody)
  async getFollowees(@Input() input: GetFolloweesRequestBody): Promise<GetFolloweesResponseBody> {
    const { followeeIDs } = await this.queryBus.execute(new GetFolloweesQuery(input))

    const { profilePreviews: followees } = await this.queryBus.execute(
      new GetProfilePreviewsByIDsQuery({ ids: followeeIDs })
    )

    return {
      count: followees.length,
      followees
    }
  }
}
