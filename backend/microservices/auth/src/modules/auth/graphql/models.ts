import { ObjectType } from "@nestjs/graphql"
import { UserEntity } from "../../users/entity"

@ObjectType()
export class User extends UserEntity {}
