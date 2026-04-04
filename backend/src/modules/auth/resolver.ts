import { Injectable, UseGuards } from "@nestjs/common"
import { Query, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/decorators/current-user"
import { PublicRoute } from "src/decorators/public-route"
import { Input } from "src/utils/graphql"
import { UserEntity } from "../users/entity"
import { SigninInput, SigninOutput } from "./dtos"
import { AuthService } from "./service"
import { LocalAuthGuard } from "./strategies/local"

@Injectable()
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Query(() => SigninOutput)
  async signin(@CurrentUser() user: UserEntity, @Input() _: SigninInput): Promise<SigninOutput> {
    const result = await this.authService.signin(user)

    // TODO : Save the JWT in cookies.

    return result
  }
}
