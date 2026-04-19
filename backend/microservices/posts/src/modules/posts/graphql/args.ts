import { PaginatedInput } from "@instagram-clone/lib/utils/pagination"
import { Field, InputType, Int, PickType } from "@nestjs/graphql"
import { Post } from "./models"

@InputType()
export class CreatePostArgs extends PickType(Post, ["imageURL", "description"], InputType) {}

@InputType()
export class GetPostsByAuthorArgs extends PaginatedInput {
  @Field(() => Int)
  authorID: number
}

@InputType()
export class GetPostArgs {
  @Field(() => Int)
  id: number
}
