import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ProfileEntity } from "../entity"

export class CreateProfileCommand extends Command<void> {
  constructor(readonly input: ProfileEntity) {
    super()
  }
}

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler implements ICommandHandler<CreateProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>
  ) {}

  async execute({ input }: CreateProfileCommand): Promise<void> {
    const profile = this.profilesRepository.create(input)
    await this.profilesRepository.save(profile)
  }
}
