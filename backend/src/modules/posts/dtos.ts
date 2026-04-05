import { Field, ArgsType, Int, ObjectType, PickType } from "@nestjs/graphql"
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

@ArgsType()
export class CreatePostArgs extends PickType(Post, ["imageURL", "description"], ArgsType) {}

@ArgsType()
export class GetPostsByAuthorArgs extends PaginatedInput {
  @Field(() => Int)
  authorID: number
}

@ArgsType()
export class GetPostArgs {
  @Field(() => Int)
  id: number
}
