import { PaginatedInput } from "@instagram-clone/lib/utils/pagination"
import { Field, InputType, Int } from "@nestjs/graphql"

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
