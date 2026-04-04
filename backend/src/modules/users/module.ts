import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CreateUserHandler } from "./commands/create-user"
import { UserEntity } from "./entity"
import { GetUserHandler } from "./queries/get-user"
import { UsersResolver } from "./resolver"
import { UsersService } from "./service"

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UsersResolver,
    UsersService,

    // Commands.
    CreateUserHandler,

    // Queries.
    GetUserHandler
  ],
  exports: [UsersService]
})
export class UsersModule {}
