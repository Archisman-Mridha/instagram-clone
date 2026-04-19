import { GetUserQuery } from "@instagram-clone/microservices/auth/modules/users/queries/get-user"
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { QueryBus } from "@nestjs/cqrs"
import { GqlExecutionContext } from "@nestjs/graphql"
import { AuthGuard, PassportStrategy } from "@nestjs/passport"
import bcrypt from "bcrypt"
import { Strategy } from "passport-local"
import { UserEntity } from "../../users/entity"

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly queryBus: QueryBus) {
    super({
      usernameField: "email"
    })
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    // Ensure that the user exists.
    const user = await this.queryBus.execute(new GetUserQuery({ where: { email } }))

    // Ensure that the provided password is correct.
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw new UnauthorizedException("incorrect password")

    return user
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  getRequest(executionContext: ExecutionContext) {
    const graphQLExecutionContext = GqlExecutionContext.create(executionContext)

    const graphQLContext = graphQLExecutionContext.getContext(),
      graphQLArgs = graphQLExecutionContext.getArgs()

    graphQLContext.req.body = { ...graphQLContext.req.body, ...graphQLArgs.args }

    return graphQLContext.req
  }
}
