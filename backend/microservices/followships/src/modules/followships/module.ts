import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CreateFollowshipHandler } from "./commands/create-followship"
import { DeleteFollowshipHandler } from "./commands/delete-followship"
import { FollowshipEntity } from "./entity"
import { FollowshipsResolver } from "./graphql/resolver"
import { FollowshipExistsHandler } from "./queries/followship-exists"
import { GetFolloweesHandler } from "./queries/get-followees"
import { GetFollowersHandler } from "./queries/get-followers"
import { GetFollowshipCountsHandler } from "./queries/get-followship-counts"

@Module({
  imports: [TypeOrmModule.forFeature([FollowshipEntity])],
  providers: [
    FollowshipsResolver,

    // Commands.
    CreateFollowshipHandler,
    DeleteFollowshipHandler,

    // Queries.
    GetFollowersHandler,
    GetFolloweesHandler,
    GetFollowshipCountsHandler,
    FollowshipExistsHandler
  ]
})
export class FollowshipsModule {}
