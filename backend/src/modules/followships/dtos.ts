import { Field, ArgsType, Int, ObjectType } from "@nestjs/graphql"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { ProfilePreview } from "../profiles/dtos"

@ObjectType()
export class Follower {
  @Field(() => Int)
  id: number

  // NOTE : Resolved by the GraphQL server.
  @Field(() => ProfilePreview)
  profilePreview?: ProfilePreview & {}
}

@ObjectType()
export class Followers extends PaginatedOutput {
  @Field(() => [Follower])
  followers: Array<Follower>
}

@ObjectType()
export class Followee {
  @Field(() => Int)
  id: number

  // NOTE : Resolved by the GraphQL server.
  @Field(() => ProfilePreview)
  profilePreview?: ProfilePreview & {}
}

@ObjectType()
export class Followees extends PaginatedOutput {
  @Field(() => [Followee])
  followees: Array<Followee>
}

@ObjectType()
export class FollowshipCounts {
  @Field(() => Int)
  followerCount: number

  @Field(() => Int)
  followeeCount: number
}

@ArgsType()
export class CreateFollowshipArgs {
  @Field(() => Int)
  followeeID: number
}

@ArgsType()
export class DeleteFollowshipArgs {
  @Field(() => Int)
  followeeID: number
}

@ArgsType()
export class GetFolloweesArgs extends PaginatedInput {
  @Field(() => Int)
  followerID: number
}

@ArgsType()
export class GetFollowersArgs extends PaginatedInput {
  @Field(() => Int)
  followeeID: number
}
