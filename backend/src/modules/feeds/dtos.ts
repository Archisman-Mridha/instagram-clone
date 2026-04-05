import { Field, ArgsType, Int, ObjectType } from "@nestjs/graphql"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { Post } from "../posts/dtos"

@ObjectType()
export class Feed extends PaginatedOutput {
  @Field(() => [Number])
  postIDs: Array<number>

  // NOTE : Resolved by the GraphQL server.
  @Field(() => [Post])
  posts?: Array<Post>
}

@ArgsType()
export class GetFeedArgs extends PaginatedInput {
  @Field(() => Int)
  userID: number
}
