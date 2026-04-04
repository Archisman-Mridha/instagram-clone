import { Field, InputType, Int, ObjectType } from "@nestjs/graphql"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { PostEntity } from "../posts/entity"

@InputType()
export class GetFeedRequestBody extends PaginatedInput {
  @Field(() => Int)
  userID: number
}

@ObjectType()
export class GetFeedResponseBody extends PaginatedOutput {
  @Field(() => [PostEntity])
  posts?: Array<PostEntity>
}
