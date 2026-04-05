import { ArgsType, Field, ObjectType } from "@nestjs/graphql"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { Notification } from "./schema"

@ObjectType()
export class Notifications extends PaginatedOutput {
  @Field(() => [Notification])
  notifications: Array<Notification>
}

@ArgsType()
export class GetNotificationsArgs extends PaginatedInput {}
