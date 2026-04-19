import { PaginatedOutput } from "@instagram-clone/lib/utils/pagination"
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Feed extends PaginatedOutput {
  @Field(() => [Number])
  postIDs: Array<number>
}
