import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { EventPattern, Payload } from "@nestjs/microservices"
import { Args } from "@openmedia/backend/decorators/args"
import { CurrentUser } from "@openmedia/backend/decorators/current-user"
import { UserEntity } from "@openmedia/backend/modules/business/users/entity"
import { ProfileCreatedEvent, UserCreatedEvent } from "@openmedia/backend/utils/events"
import { KafkaTopic } from "@openmedia/backend/utils/kafka"
import { FollowshipCounts } from "../../followships/graphql/models"
import { FollowshipExistsQuery } from "../../followships/queries/followship-exists"
import { GetFollowshipCountsQuery } from "../../followships/queries/get-followship-counts"
import { Post } from "../../posts/graphql/models"
import { GetPostsByAuthorQuery } from "../../posts/queries/get-posts-by-author"
import { CreateProfileCommand } from "../commands/create-profile"
import { IndexProfileCommand } from "../commands/index-profile"
import { GetProfileByIDQuery } from "../queries/get-profile-by-id"
import { SearchProfilesQuery } from "../queries/search-profiles"
import { GetProfileByIDArgs, SearchProfilesArgs } from "./args"
import { Profile, ProfilePreviews } from "./models"

@Injectable()
@Resolver(
	/*
    Here, it's important to specify Profile, instead of ( ) => Profile. Otherwise, things will
    break.

    NestJS's getResolverTypeFn( ) checks whether the passed argument has a .prototype propery.
    When it does, it means that the passed argument is Person. Otherwise, it's ( ) => Person.

    But, SWC (used by RsPack) compiles the arrow function : ( ) => Profile to regular function :
    function( ) { return Profile }. And this regular function has the .prototype property. So,
    NestJS ends up treating it as a class reference, and wraps it, which leads to :
  */
	Profile
)
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

		// Find out whethe the current user follows this profile.
		// Or in other words, whether this profile is a followee of the user.
		const isFollowee = await this.queryBus.execute(
			new FollowshipExistsQuery({
				followerID: user.id,
				followeeID: profileEntity.id
			})
		)

		const profile = {
			...profileEntity,
			isFollowee
		}
		return profile
	}

	@ResolveField(() => FollowshipCounts)
	async followshipCounts(@Parent() profile: Profile): Promise<FollowshipCounts> {
		return this.queryBus.execute(new GetFollowshipCountsQuery({ profileID: profile.id }))
	}

	@ResolveField(() => [Post])
	async posts(@Parent() profile: Profile): Promise<Array<Post>> {
		const { posts } = await this.queryBus.execute(
			new GetPostsByAuthorQuery({
				authorID: profile.id
			})
		)
		return posts
	}
}
