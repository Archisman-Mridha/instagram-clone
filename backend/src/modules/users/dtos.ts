import { InputType, PickType } from "@nestjs/graphql"
import { UserEntity } from "./entity"

@InputType()
export class CreateUserRequestBody extends PickType(
  UserEntity,
  ["name", "email", "username", "password"],
  InputType
) {}
