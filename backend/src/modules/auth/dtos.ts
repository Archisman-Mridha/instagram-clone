import { Field, InputType, ObjectType, PickType, ID } from "@nestjs/graphql"
import { UserEntity } from "../users/entity"

@InputType()
export class SigninArgs extends PickType(UserEntity, ["email", "password"], InputType) {}

@ObjectType()
export class SigninOutput {
  @Field(() => ID)
  userID: number

  @Field()
  accessToken: string
}
