import { Field, InputType, Int, ObjectType } from "@nestjs/graphql"
import { IsPositive, Min } from "class-validator"

const DEFAULT_TAKE = 25

@InputType({ isAbstract: true })
export abstract class PaginatedInput {
  @Min(0)
  @Field(() => Int, { defaultValue: 0 })
  skip?: number = 0

  @IsPositive()
  @Field(() => Int, { defaultValue: DEFAULT_TAKE })
  take?: number = DEFAULT_TAKE
}

@ObjectType({ isAbstract: true })
export abstract class PaginatedOutput {
  @Field(() => Int)
  count: number
}
