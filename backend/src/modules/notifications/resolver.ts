import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { EventPattern, Payload } from "@nestjs/microservices"
import { CurrentUser } from "src/decorators/current-user"
import { KafkaTopic } from "../../utils/kafka"
import { type FollowshipCreatedEvent } from "../followships/events"
import { CreateNotificationCommand } from "./commands/create-notification"
import { GetNotificationsArgs, Notifications } from "./dtos"
import { GetNotificationsQuery } from "./queries/get-notifications"

@Resolver()
export class NotificationsResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @EventPattern(KafkaTopic.EVENTS_FOLLOWSHIPS_CREATED)
  async onFollowshipCreated(@Payload() event: FollowshipCreatedEvent): Promise<void> {
    return this.commandBus.execute(new CreateNotificationCommand(event))
  }

  @Query(() => Notifications)
  async getNotifications(
    @CurrentUser() userID: number,
    @Args() args: GetNotificationsArgs
  ): Promise<Notifications> {
    return this.queryBus.execute(new GetNotificationsQuery({ userID, ...args }))
  }
}
