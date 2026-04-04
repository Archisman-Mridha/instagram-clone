import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CreateNotificationHandler } from "./commands/create-notification"
import { GetNotificationsHandler } from "./queries/get-notifications"
import { NotificationsResolver } from "./resolver"
import {
  NewFollowerNotification,
  NewFollowerNotificationSchema,
  Notification,
  NotificationSchema
} from "./schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,

        discriminators: [
          { name: NewFollowerNotification.name, schema: NewFollowerNotificationSchema }
        ]
      }
    ])
  ],
  providers: [
    NotificationsResolver,

    // Commands.
    CreateNotificationHandler,

    // Queries.
    GetNotificationsHandler
  ]
})
export class NotificationsModule {}
