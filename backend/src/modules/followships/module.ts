import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CreateFollowshipHandler } from "./commands/create-followship"
import { DeleteFollowshipHandler } from "./commands/delete-followship"
import { FollowshipEntity } from "./entity"
import { GetFolloweesHandler } from "./queries/get-followees"
import { GetFollowersHandler } from "./queries/get-followers"
import { FollowshipsResolver } from "./resolver"

@Module({
  imports: [TypeOrmModule.forFeature([FollowshipEntity])],
  providers: [
    FollowshipsResolver,

    // Commands.
    CreateFollowshipHandler,
    DeleteFollowshipHandler,

    // Queries.
    GetFollowersHandler,
    GetFolloweesHandler
  ]
})
export class FollowshipsModule {}
