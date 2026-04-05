import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { ProfilePreview } from "../profiles/dtos"
import { PostEntity } from "./entity"

@ObjectType()
export class Post extends PostEntity {
  // NOTE : Resolved by the GraphQL server.
  @Field(() => ProfilePreview)
  authorProfilePreview?: ProfilePreview
}

@ObjectType()
export class Posts extends PaginatedOutput {
  @Field(() => [Post])
  posts: Array<Post>
}

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
