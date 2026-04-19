import { UserEntity } from "@instagram-clone/microservices/auth/modules/users/entity"
import { GetUserQuery } from "@instagram-clone/microservices/auth/modules/users/queries/get-user"
import { IS_PUBLIC_ROUTE_KEY } from "@instagram-clone/lib/decorators/public-route"
import { ExecutionContext, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Reflector } from "@nestjs/core"
import { QueryBus } from "@nestjs/cqrs"
import { GqlExecutionContext } from "@nestjs/graphql"
import { AuthGuard, PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

export interface JWTPayload {
  // Registered Claims :
  // The following Claim Names are registered in the IANA "JSON Web Token Claims" registry.
  // None of the claims defined below are intended to be mandatory to use or implement in all
  // cases, but rather they provide a starting point for a set of useful, interoperable claims.
  // All the names are short because a core goal of JWTs is for the representation to be compact.

  // (1) The "iss" (issuer) claim identifies the principal that issued the JWT. The "iss" value is
  //     a case-sensitive string containing a StringOrURI value.

  // (2) The "sub" (subject) claim identifies the principal that is the subject of the JWT. The
  //     claims in a JWT are normally statements about the subject.
  sub: number

  // (3) The "aud" (audience) claim identifies the recipients that the JWT is intended for. Each
  //     principal intended to process the JWT MUST identify itself with a value in the audience
  //     claim. If the principal processing the claim does not identify itself with a value in the
  //     "aud" claim when this claim is present, then the JWT MUST be rejected. In the general
  //     case, the "aud" value is an array of case-sensitive strings, each containing a StringOrURI
  //     value. In the special case when the JWT has one audience, the "aud" value MAY be a single
  //     case-sensitive string containing a StringOrURI value.

  // (4) The "exp" (expiration time) claim identifies the expiration time on or after which the JWT
  //     MUST NOT be accepted for processing. The processing of the "exp" claim requires that the
  //     current date/time MUST be before the expiration date/time listed in the "exp" claim.

  // Public Claims :
  // Claim Names can be defined at will by those using JWTs. However, in order to prevent
  // collisions, any new Claim Name should either be registered in the IANA "JSON Web Token Claims"
  // registry or be a Public Name: a value that contains a Collision-Resistant Name. In each case,
  // the definer of the name or value needs to take reasonable precautions to make sure they are in
  // control of the part of the namespace they use to define the Claim Name.

  email: string
}

@Injectable()
export class JWTAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly queryBus: QueryBus
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Either from the bearer token in header,
        ExtractJwt.fromAuthHeaderAsBearerToken(),

        // Or from the cookies.
        (request: any) => request?.cookies?.access_token
      ]),
      ignoreExpiration: false,

      secretOrKey: configService.getOrThrow("JWT_SIGNING_SECRET")
    })
  }

  /*
    Passport first verifies the JWT's signature and decodes the JSON. It then invokes our
    validate( ) method passing the decoded JSON as its single parameter. Based on the way JWT
    signing works, we're guaranteed that we're receiving a valid token that we have previously
    signed and issued to a valid user.

    Passport will build a user object based on the return value of our validate( ) method, and
    attach it as a property on the Request object.

    NOTE : You can instead return an array, where the first value is used to create a user object
           and the second value is used to create an authInfo object.

    It's also worth pointing out that this approach leaves us room ('hooks' as it were) to inject
    other business logic into the process. For example, we could do a database lookup in our
    validate( ) method to extract more information about the user, resulting in a more enriched
    user object being available in our Request. This is also the place we may decide to do further
    token validation, such as looking up the userId in a list of revoked tokens, enabling us to
    perform token revocation.
  */
  async validate(jwtPayload: JWTPayload): Promise<UserEntity> {
    // Ensure that the user exists.
    const id = jwtPayload.sub
    const user = await this.queryBus.execute(new GetUserQuery({ where: { id } }))

    return user
  }
}

@Injectable()
export class JWTAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  getRequest(executionContext: ExecutionContext) {
    const graphQLExecutionContext = GqlExecutionContext.create(executionContext)
    return graphQLExecutionContext.getContext().req
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    // Don't activate the guard for public routes.
    if (isPublic) return true

    return super.canActivate(context)
  }
}
