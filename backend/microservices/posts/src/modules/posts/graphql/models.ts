import { PaginatedOutput } from "@instagram-clone/lib/utils/pagination"
import { Field, ObjectType } from "@nestjs/graphql"
import { PostEntity } from "../entity"

@ObjectType()
export class Post extends PostEntity {}

@ObjectType()
export class Posts extends PaginatedOutput {
  @Field(() => [Post])
  posts: Array<Post>
}
