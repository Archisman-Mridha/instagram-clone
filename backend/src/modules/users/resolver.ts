import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { PublicRoute } from "src/decorators/public-route"
import { SigninOutput } from "../auth/dtos"
import { SigninQuery } from "../auth/queries/signin"
import { CreateUserCommand } from "./commands/create-user"
import { CreateUserArgs } from "./dtos"

@Injectable()
@Resolver()
export class UsersResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @PublicRoute()
  @Mutation(() => SigninOutput)
  async createUser(@Args() args: CreateUserArgs): Promise<SigninOutput> {
    const user = await this.commandBus.execute(new CreateUserCommand(args))

    return this.queryBus.execute(new SigninQuery(user))
  }
}
