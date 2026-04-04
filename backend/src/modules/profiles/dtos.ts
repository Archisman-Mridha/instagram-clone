import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { ProfileEntity } from "./entity"

@InputType()
export class SearchProfilesRequestBody extends PaginatedInput {
  @Field()
  query: string
}

@ObjectType()
export class SearchProfilesResponseBody extends PaginatedOutput {
  @Field(() => [ProfilePreview])
  profilePreviews: Array<ProfilePreview>
}

@ObjectType()
export class ProfilePreview extends PickType(ProfileEntity, ["id", "name", "username"]) {}
