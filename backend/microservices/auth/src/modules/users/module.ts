import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CreateUserHandler } from "./commands/create-user"
import { UserEntity } from "./entity"
import { GetUserHandler } from "./queries/get-user"

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    // Commands.
    CreateUserHandler,

    // Queries.
    GetUserHandler
  ]
})
export class UsersModule {}
