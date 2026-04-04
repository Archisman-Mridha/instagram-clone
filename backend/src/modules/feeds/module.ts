import { Module } from "@nestjs/common"
import { RedisModule } from "../redis/module"
import { GetFeedHandler } from "./queries/get-feed"
import { FeedsResolver } from "./resolver"

@Module({
  imports: [RedisModule],
  providers: [
    FeedsResolver,

    // Queries.
    GetFeedHandler
  ]
})
export class FeedsModule {}
