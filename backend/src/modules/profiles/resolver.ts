import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Query, Resolver } from "@nestjs/graphql"
import { EventPattern, Payload } from "@nestjs/microservices"
import { Input } from "src/utils/graphql"
import { KafkaTopic } from "../../utils/kafka"
import { UserCreatedEvent } from "../users/events"
import { CreateProfileCommand } from "./commands/create-profile"
import { IndexProfileCommand } from "./commands/index-profile"
import { SearchProfilesRequestBody, SearchProfilesResponseBody } from "./dtos"
import { ProfileEntity } from "./entity"
import { ProfileCreatedEvent } from "./events"
import { SearchProfilesQuery } from "./queries/search-profiles"

@Injectable()
@Resolver(() => ProfileEntity)
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

  @Query(() => SearchProfilesResponseBody)
  async searchProfiles(
    @Input() input: SearchProfilesRequestBody
  ): Promise<SearchProfilesResponseBody> {
    return this.queryBus.execute(new SearchProfilesQuery(input))
  }
}
