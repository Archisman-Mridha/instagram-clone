import { Field, ArgsType, ObjectType, PickType, ID } from "@nestjs/graphql"
import { UserEntity } from "../users/entity"

@ArgsType()
export class SigninArgs extends PickType(UserEntity, ["email", "password"], ArgsType) {}

@ObjectType()
export class SigninOutput {
  @Field(() => ID)
  userID: number

  @Field()
  accessToken: string
}
