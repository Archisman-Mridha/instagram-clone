import { Injectable } from "@nestjs/common"
import { Mutation, Resolver } from "@nestjs/graphql"
import { PublicRoute } from "src/decorators/public-route"
import { Input } from "src/utils/graphql"
import { CreateUserRequestBody } from "./dtos"
import { UserEntity } from "./entity"
import { SigninOutput } from "../auth/dtos"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { SigninQuery } from "../auth/queries/signin"
import { CreateUserCommand } from "./commands/create-user"

@Injectable()
@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @PublicRoute()
  @Mutation(() => SigninOutput)
  async createUser(@Input() input: CreateUserRequestBody): Promise<SigninOutput> {
    const user = await this.commandBus.execute(new CreateUserCommand(input))

    return this.queryBus.execute(new SigninQuery(user))
  }
}
