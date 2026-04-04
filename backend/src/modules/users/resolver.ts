import { Injectable } from "@nestjs/common"
import { Mutation, Resolver } from "@nestjs/graphql"
import { PublicRoute } from "src/decorators/public-route"
import { Input } from "src/utils/graphql"
import { CreateUserRequestBody, CreateUserResponseBody } from "./dtos"
import { UserEntity } from "./entity"
import { UsersService } from "./service"

@Injectable()
@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @PublicRoute()
  @Mutation(() => CreateUserResponseBody)
  createUser(@Input() input: CreateUserRequestBody): Promise<CreateUserResponseBody> {
    return this.usersService.createUser(input)
  }
}
