import { PublicRoute } from "@instagram-clone/lib/decorators/public-route"
import { Injectable } from "@nestjs/common"
import { Query, Resolver } from "@nestjs/graphql"

@Injectable()
@Resolver()
@PublicRoute()
export class PingResolver {
  @Query(() => String)
  ping() {
    return "pong"
  }
}
