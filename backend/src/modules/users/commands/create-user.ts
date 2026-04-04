import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserEntity } from "../entity"

export interface CreateUserInput {
  name: string
  email: string
  username: string
  password: string
}

export interface CreateUserOutput {
  id: number
}

export class CreateUserCommand extends Command<CreateUserOutput> {
  constructor(readonly input: CreateUserInput) {
    super()
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  async execute({ input }: CreateUserCommand): Promise<CreateUserOutput> {
    let user = this.usersRepository.create(input)
    user = await this.usersRepository.save(user)

    return { id: user.id }
  }
}
