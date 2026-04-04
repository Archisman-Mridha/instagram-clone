import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql"
import { UserEntity } from "../users/entity"

@InputType()
export class SigninInput extends PickType(UserEntity, ["email", "password"], InputType) {}

@ObjectType()
export class SigninOutput {
  @Field()
  accessToken: string
}
