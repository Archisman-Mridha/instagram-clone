import { ConfigSchema } from "@instagram-clone/microservices/auth/config/config"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import z from "zod"
import { AuthResolver } from "./graphql/resolvers"
import { SigninHandler } from "./queries/signin"
import { JWTAuthGuard } from "./strategies/jwt"
import { JWTAuthStrategy } from "./strategies/jwt"
import { LocalAuthStrategy } from "./strategies/local"

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService<z.infer<typeof ConfigSchema>>) => ({
        global: true,

        secret: configService.getOrThrow("JWT_SIGNING_SECRET"),

        signOptions: {
          issuer: configService.getOrThrow("JWT_ISSUER"),
          audience: configService.getOrThrow("JWT_AUDIENCE"),
          expiresIn: configService.getOrThrow("JWT_EXPIRES_AFTER")
        }
      })
    })
  ],
  providers: [
    LocalAuthStrategy,
    JWTAuthStrategy,

    // Enable the JWT authentication guard gloablly.
    // You can omit the guard for a specific route, by using the @PublicRoute( ) decorator.
    { provide: APP_GUARD, useClass: JWTAuthGuard },

    AuthResolver,

    // Queries.
    SigninHandler
  ]
})
export class AuthModule {}
