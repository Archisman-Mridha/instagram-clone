import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FollowshipEntity } from "../entity"

export interface CreateFollowshipInput {
  followerID: number
  followeeID: number
}

export class CreateFollowshipCommand extends Command<void> {
  constructor(readonly input: CreateFollowshipInput) {
    super()
  }
}

@CommandHandler(CreateFollowshipCommand)
export class CreateFollowshipHandler implements ICommandHandler<CreateFollowshipCommand> {
  constructor(
    @InjectRepository(FollowshipEntity)
    private readonly followshipsRepository: Repository<FollowshipEntity>
  ) {}

  async execute({ input }: CreateFollowshipCommand): Promise<void> {
    const followship = this.followshipsRepository.create(input)
    await this.followshipsRepository.save(followship)
  }
}
