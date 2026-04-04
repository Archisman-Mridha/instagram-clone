import { Field, InputType, ObjectType } from "@nestjs/graphql"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { Notification } from "./schema"

@InputType()
export class GetNotificationsRequestBody extends PaginatedInput {}

@ObjectType()
export class GetNotificationsResponseBody extends PaginatedOutput {
  @Field(() => [Notification])
  notifications: Array<Notification>
}
