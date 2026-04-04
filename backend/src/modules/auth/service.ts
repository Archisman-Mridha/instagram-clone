import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserEntity } from "../users/entity"
import { SigninOutput } from "./dtos"
import { JWTPayload } from "./strategies/jwt"

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signin(user: UserEntity): Promise<SigninOutput> {
    const jwtPayload: JWTPayload = { sub: user.id, ...user }
    const accessToken = await this.jwtService.signAsync(jwtPayload)

    return { accessToken }
  }
}
