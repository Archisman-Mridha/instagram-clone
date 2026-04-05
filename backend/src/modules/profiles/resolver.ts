import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { EventPattern, Payload } from "@nestjs/microservices"
import { Args } from "src/utils/graphql"
import { KafkaTopic } from "../../utils/kafka"
import { FollowshipCounts } from "../followships/dtos"
import { GetFollowshipCountsQuery } from "../followships/queries/get-followship-counts"
import { Post } from "../posts/dtos"
import { GetPostsByAuthorQuery } from "../posts/queries/get-posts-by-author"
import { UserCreatedEvent } from "../users/events"
import { CreateProfileCommand } from "./commands/create-profile"
import { IndexProfileCommand } from "./commands/index-profile"
import { GetProfileByIDArgs, Profile, ProfilePreviews, SearchProfilesArgs } from "./dtos"
import { ProfileCreatedEvent } from "./events"
import { GetProfileByIDQuery } from "./queries/get-profile-by-id"
import { SearchProfilesQuery } from "./queries/search-profiles"

@Injectable()
@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @EventPattern(KafkaTopic.EVENTS_USERS_CREATED)
  async onUserCreated(@Payload() event: UserCreatedEvent): Promise<void> {
    await this.commandBus.execute(new CreateProfileCommand(event.payload.after))
  }

  @EventPattern(KafkaTopic.EVENTS_PROFILES_CREATED)
  async onProfileCreated(@Payload() event: ProfileCreatedEvent): Promise<void> {
    await this.commandBus.execute(new IndexProfileCommand(event.payload.after))
  }

  @Query(() => ProfilePreviews)
  async searchProfiles(@Args() args: SearchProfilesArgs): Promise<ProfilePreviews> {
    return this.queryBus.execute(new SearchProfilesQuery(args))
  }

  @Query(() => Profile)
  async getProfileByID(@Args() args: GetProfileByIDArgs): Promise<Profile> {
    return this.queryBus.execute(new GetProfileByIDQuery(args))
  }

  @ResolveField(() => [Post])
  async followshipCounts(@Parent() profile: Profile): Promise<FollowshipCounts> {
    return this.queryBus.execute(new GetFollowshipCountsQuery({ profileID: profile.id }))
  }

  @ResolveField(() => [Post])
  async posts(@Parent() profile: Profile): Promise<Array<Post>> {
    const { posts } = await this.queryBus.execute(
      new GetPostsByAuthorQuery({ authorID: profile.id })
    )
    return posts
  }
}
