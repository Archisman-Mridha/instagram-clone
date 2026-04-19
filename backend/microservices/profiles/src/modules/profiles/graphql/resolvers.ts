import { UserEntity } from "@instagram-clone/microservices/auth/modules/users/entity"
import { Args } from "@instagram-clone/lib/decorators/args"
import { CurrentUser } from "@instagram-clone/lib/decorators/current-user"
import { UserCreatedEvent, ProfileCreatedEvent } from "@instagram-clone/lib/utils/events"
import { KafkaTopic } from "@instagram-clone/lib/utils/kafka"
import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Query, Resolver } from "@nestjs/graphql"
import { EventPattern, Payload } from "@nestjs/microservices"
import { CreateProfileCommand } from "../commands/create-profile"
import { IndexProfileCommand } from "../commands/index-profile"
import { GetProfileByIDQuery } from "../queries/get-profile-by-id"
import { SearchProfilesQuery } from "../queries/search-profiles"
import { GetProfileByIDArgs, SearchProfilesArgs } from "./args"
import { Profile, ProfilePreviews } from "./models"

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
  async getProfileByID(
    @CurrentUser() user: UserEntity,
    @Args() args: GetProfileByIDArgs
  ): Promise<Profile> {
    const profileEntity = await this.queryBus.execute(new GetProfileByIDQuery(args))

    /*
      TODO : We need to invoke the followships microservice, to get this data.

      // Find out whethe the current user follows this profile.
      // Or in other words, whether this profile is a followee of the user.
      const isFollowee = await this.queryBus.execute(
        new FollowshipExistsQuery({
          followerID: user.id,
          followeeID: profileEntity.id
        })
      )
    */
    const isFollowee = false

    const profile = {
      ...profileEntity,
      isFollowee
    }
    return profile
  }
}
