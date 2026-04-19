import { PaginatedInput } from "@instagram-clone/lib/utils/pagination"
import { InputType } from "@nestjs/graphql"

@InputType()
export class GetFeedArgs extends PaginatedInput {}
