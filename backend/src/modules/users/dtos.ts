import { InputType, ObjectType, PickType } from "@nestjs/graphql"
import { UserEntity } from "./entity"

@ObjectType()
export class User extends UserEntity {}

@InputType()
export class CreateUserArgs extends PickType(
  User,
  ["name", "email", "username", "password"],
  InputType
) {}
