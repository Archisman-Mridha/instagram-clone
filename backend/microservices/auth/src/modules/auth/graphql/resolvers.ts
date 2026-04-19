import { Args } from "@instagram-clone/lib/decorators/args"
import { CurrentUser } from "@instagram-clone/lib/decorators/current-user"
import { PublicRoute } from "@instagram-clone/lib/decorators/public-route"
import { Injectable, UseGuards } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Mutation, Query, Resolver } from "@nestjs/graphql"
import { CreateUserCommand } from "../../users/commands/create-user"
import { UserEntity } from "../../users/entity"
import { SigninQuery } from "../queries/signin"
import { LocalAuthGuard } from "../strategies/local"
import { SigninArgs, SigninOutput, SignupArgs } from "./args"

@Injectable()
@Resolver()
export class AuthResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @PublicRoute()
  @Mutation(() => SigninOutput)
  async signup(@Args() args: SignupArgs) {
    const user = await this.commandBus.execute(new CreateUserCommand(args))

    return this.queryBus.execute(new SigninQuery(user))
  }

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Query(() => SigninOutput)
  async signin(@CurrentUser() user: UserEntity, @Args() _: SigninArgs): Promise<SigninOutput> {
    return this.queryBus.execute(new SigninQuery(user))
  }
}
