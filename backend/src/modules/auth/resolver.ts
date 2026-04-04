import { Injectable, UseGuards } from "@nestjs/common"
import { Query, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/decorators/current-user"
import { PublicRoute } from "src/decorators/public-route"
import { Input } from "src/utils/graphql"
import { UserEntity } from "../users/entity"
import { SigninInput, SigninOutput } from "./dtos"
import { LocalAuthGuard } from "./strategies/local"
import { QueryBus } from "@nestjs/cqrs"
import { SigninQuery } from "./queries/signin"

@Injectable()
@Resolver()
export class AuthResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Query(() => SigninOutput)
  async signin(@CurrentUser() user: UserEntity, @Input() _: SigninInput): Promise<SigninOutput> {
    // TODO : Save the JWT in cookies.

    return this.queryBus.execute(new SigninQuery(user))
  }
}
