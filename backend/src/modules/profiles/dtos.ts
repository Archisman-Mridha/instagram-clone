import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { FollowshipCounts } from "../followships/dtos"
import { Post } from "../posts/dtos"
import { ProfileEntity } from "./entity"

@ObjectType()
export class Profile extends ProfileEntity {
  @Field()
  isFollowee: boolean

  // NOTE : Resolved by the GraphQL server.
  @Field(() => FollowshipCounts)
  followshipCounts?: FollowshipCounts & {}

  // NOTE : Resolved by the GraphQL server.
  @Field(() => [Post])
  posts?: Array<Post>
}

@ObjectType()
export class ProfilePreview extends PickType(Profile, ["id", "name", "username"]) {}

@ObjectType()
export class ProfilePreviews extends PaginatedOutput {
  @Field(() => [ProfilePreview])
  profilePreviews: Array<ProfilePreview>
}

@InputType()
export class SearchProfilesArgs extends PaginatedInput {
  @Field()
  query: string
}

@InputType()
export class GetProfileByIDArgs {
  @Field(() => Int)
  id: number
}
