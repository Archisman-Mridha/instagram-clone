import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { FindOneOptions } from "typeorm"
import { CreateUserCommand, CreateUserInput, CreateUserOutput } from "./commands/create-user"
import { UserEntity } from "./entity"
import { GetUserQuery } from "./queries/get-user"

@Injectable()
export class UsersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async createUser(input: CreateUserInput): Promise<CreateUserOutput> {
    return this.commandBus.execute(new CreateUserCommand(input))
  }

  async getUser(query: FindOneOptions<UserEntity>): Promise<UserEntity> {
    return this.queryBus.execute(new GetUserQuery(query))
  }
}
