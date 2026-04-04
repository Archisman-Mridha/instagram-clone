import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { InjectModel } from "@nestjs/mongoose"
import { Match } from "effect"
import { Model } from "mongoose"
import { CDC } from "src/utils/event"
import { FollowshipCreatedEvent } from "../../followships/events"
import { NewFollowerNotification, Notification, NotificationKind } from "../schema"

export class CreateNotificationCommand extends Command<void> {
  constructor(readonly event: CDC.Event<unknown>) {
    super()
  }
}

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationHandler implements ICommandHandler<CreateNotificationCommand> {
  constructor(
    @InjectModel(NewFollowerNotification.name)
    private readonly newFollowerNotificationsRepository: Model<NewFollowerNotification>
  ) {}

  async execute({ event }: CreateNotificationCommand): Promise<void> {
    const _ = Match.type<CDC.Event<unknown>>().pipe(
      Match.withReturnType<Promise<Notification>>(),

      Match.when(Match.instanceOf(FollowshipCreatedEvent), async (event) => {
        const {
          payload: {
            after: { followeeID, followerID }
          }
        } = event

        return await this.newFollowerNotificationsRepository.create({
          userID: followeeID,
          kind: NotificationKind.NEW_FOLLOWER,

          followerID
        })
      }),

      Match.exhaustive
    )(event)
  }
}
