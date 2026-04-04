import { Field, InputType, Int, ObjectType } from "@nestjs/graphql"
import { IsPositive, Min } from "class-validator"

@InputType({ isAbstract: true })
export abstract class PaginatedInput {
  @Min(0)
  @Field(() => Int, { defaultValue: 0 })
  skip: number

  @IsPositive()
  @Field(() => Int, { defaultValue: 25 })
  take: number
}

@ObjectType({ isAbstract: true })
export abstract class PaginatedOutput {
  @Field(() => Int)
  count: number
}
