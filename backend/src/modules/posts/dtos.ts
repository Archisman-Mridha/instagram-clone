import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { PostEntity } from "./entity"

@InputType()
export class CreatePostRequestBody extends PickType(
  PostEntity,
  ["imageURL", "description"],
  InputType
) {}

@ObjectType()
export class CreatePostResponseBody extends PickType(PostEntity, ["id"]) {}

@InputType()
export class GetPostsByAuthorRequestBody extends PaginatedInput {
  @Field(() => Int)
  authorID: number
}

@ObjectType()
export class GetPostsByAuthorResponseBody extends PaginatedOutput {
  @Field(() => [PostEntity])
  posts: Array<PostEntity>
}
