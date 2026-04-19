import { Module } from "@nestjs/common"
import { FeedsResolver } from "./graphql/resolvers"
import { GetFeedHandler } from "./queries/get-feed"

@Module({
  providers: [
    FeedsResolver,

    // Queries.
    GetFeedHandler
  ]
})
export class FeedsModule {}
