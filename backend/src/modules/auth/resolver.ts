import { Injectable, UseGuards } from "@nestjs/common"
import { QueryBus } from "@nestjs/cqrs"
import { Query, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/decorators/current-user"
import { PublicRoute } from "src/decorators/public-route"
import { Args } from "src/utils/graphql"
import { UserEntity } from "../users/entity"
import { SigninArgs, SigninOutput } from "./dtos"
import { SigninQuery } from "./queries/signin"
import { LocalAuthGuard } from "./strategies/local"

@Injectable()
@Resolver()
export class AuthResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Query(() => SigninOutput)
  async signin(@CurrentUser() user: UserEntity, @Args() _: SigninArgs): Promise<SigninOutput> {
    return this.queryBus.execute(new SigninQuery(user))
  }
}
