import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CreateUserHandler } from "./commands/create-user"
import { UserEntity } from "./entity"
import { GetUserHandler } from "./queries/get-user"
import { UsersResolver } from "./resolver"

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UsersResolver,

    // Commands.
    CreateUserHandler,

    // Queries.
    GetUserHandler
  ]
})
export class UsersModule {}
