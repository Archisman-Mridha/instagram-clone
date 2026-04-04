import { UnprocessableEntityException } from "@nestjs/common"
import { createUnionType, Field, ID, Int, ObjectType, registerEnumType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Schema as MongooseSchema } from "mongoose"
import { MongoDBSortOrder } from "src/utils/mongodb"

const NOTIFICATION_TTL = 30 * 24 * 60 * 60 // s = 30 days.

export enum NotificationKind {
  NEW_FOLLOWER
}

registerEnumType(NotificationKind, { name: "NotificationType" })

@ObjectType()
@Schema({
  collection: "notifications",

  discriminatorKey: "type"
})
export class Notification {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId

  @Field(() => Int)
  @Prop({ required: true })
  userID: number

  @Field()
  @Prop({
    type: Number,
    enum: NotificationKind,

    required: true
  })
  kind: NotificationKind

  @Field()
  @Prop({ default: false })
  seen: boolean

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)

NotificationSchema.index({
  userID: MongoDBSortOrder.ASCENDING,
  createdAt: MongoDBSortOrder.DESCENDING
})

// Tell MongoDB to expire notifications after NOTIFICATION_TTL seconds.
NotificationSchema.index(
  { createdAt: MongoDBSortOrder.ASCENDING },
  { expireAfterSeconds: NOTIFICATION_TTL }
)

@Schema()
export class NewFollowerNotification extends Notification {
  @Field(() => Int)
  @Prop({ required: true })
  followerID: number
}

export const NewFollowerNotificationSchema = SchemaFactory.createForClass(NewFollowerNotification)

export const NotificationUnion = createUnionType({
  name: "NotificationUnion",

  types: () => [NewFollowerNotification],

  resolveType: (notification: Notification) => {
    switch (notification.kind) {
      case NotificationKind.NEW_FOLLOWER:
        return NewFollowerNotification

      default:
        throw new UnprocessableEntityException("unknown notification type")
    }
  }
})
