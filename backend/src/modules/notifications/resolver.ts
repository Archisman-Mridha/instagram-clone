import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Query, Resolver } from "@nestjs/graphql"
import { EventPattern, Payload } from "@nestjs/microservices"
import { CurrentUser } from "src/decorators/current-user"
import { Input } from "src/utils/graphql"
import { KafkaTopic } from "../../utils/kafka"
import { type FollowshipCreatedEvent } from "../followships/events"
import { CreateNotificationCommand } from "./commands/create-notification"
import { GetNotificationsRequestBody, GetNotificationsResponseBody } from "./dtos"
import { GetNotificationsQuery } from "./queries/get-notifications"
import { Notification } from "./schema"

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @EventPattern(KafkaTopic.EVENTS_FOLLOWSHIPS_CREATED)
  async onFollowshipCreated(@Payload() event: FollowshipCreatedEvent): Promise<void> {
    return this.commandBus.execute(new CreateNotificationCommand(event))
  }

  @Query(() => GetNotificationsResponseBody)
  async getNotifications(
    @CurrentUser() userID: number,
    @Input() input: GetNotificationsRequestBody
  ): Promise<GetNotificationsResponseBody> {
    return this.queryBus.execute(new GetNotificationsQuery({ userID, ...input }))
  }
}
