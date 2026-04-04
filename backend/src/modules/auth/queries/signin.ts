import { IQueryHandler, Query } from "@nestjs/cqrs"
import { JwtService } from "@nestjs/jwt"
import { UserEntity } from "src/modules/users/entity"
import { JWTPayload } from "../strategies/jwt"

export interface SigninOutput {
  accessToken: string
}

export class SigninQuery extends Query<SigninOutput> {
  constructor(readonly user: UserEntity) {
    super()
  }
}

export class SigninHandler implements IQueryHandler<SigninQuery> {
  constructor(private readonly jwtService: JwtService) {}

  async execute({ user }: SigninQuery): Promise<any> {
    const jwtPayload: JWTPayload = { sub: user.id, ...user }
    const accessToken = await this.jwtService.signAsync(jwtPayload)

    return { accessToken }
  }
}
