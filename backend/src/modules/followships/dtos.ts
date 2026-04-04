import { Field, InputType, Int, ObjectType } from "@nestjs/graphql"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { ProfilePreview } from "../profiles/dtos"

@InputType()
export class CreateFollowshipRequestBody {
  @Field(() => Int)
  followeeID: number
}

@InputType()
export class DeleteFollowshipRequestBody {
  @Field(() => Int)
  followeeID: number
}

@InputType()
export class GetFolloweesRequestBody extends PaginatedInput {
  @Field(() => Int)
  followerID: number
}

@ObjectType()
export class GetFolloweesResponseBody extends PaginatedOutput {
  @Field(() => [ProfilePreview])
  followees: Array<ProfilePreview>
}

@InputType()
export class GetFollowersRequestBody extends PaginatedInput {
  @Field(() => Int)
  followeeID: number
}

@ObjectType()
export class GetFollowersResponseBody extends PaginatedOutput {
  @Field(() => [ProfilePreview])
  followers: Array<ProfilePreview>
}
