import { Field, InputType, ObjectType, PickType, ID } from "@nestjs/graphql"
import { User } from "./models"

@InputType()
export class SignupArgs extends PickType(
  User,
  ["name", "email", "username", "password"],
  InputType
) {}

@InputType()
export class SigninArgs extends PickType(User, ["email", "password"], InputType) {}

@ObjectType()
export class SigninOutput {
  @Field(() => ID)
  userID: number

  @Field()
  accessToken: string
}
