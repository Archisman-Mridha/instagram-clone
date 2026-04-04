import { Injectable } from "@nestjs/common"
import { Query, Resolver } from "@nestjs/graphql"
import { PublicRoute } from "src/decorators/public-route"

@Injectable()
@Resolver()
@PublicRoute()
export class PingResolver {
  @Query(() => String)
  ping() {
    return "pong"
  }
}
