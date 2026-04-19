import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FollowshipEntity } from "../entity"

export interface DeleteFollowshipInput {
  followerID: number
  followeeID: number
}

export class DeleteFollowshipCommand extends Command<void> {
  constructor(readonly input: DeleteFollowshipInput) {
    super()
  }
}

@CommandHandler(DeleteFollowshipCommand)
export class DeleteFollowshipHandler implements ICommandHandler<DeleteFollowshipCommand> {
  constructor(
    @InjectRepository(FollowshipEntity)
    private readonly followshipsRepository: Repository<FollowshipEntity>
  ) {}

  async execute({ input }: DeleteFollowshipCommand): Promise<void> {
    await this.followshipsRepository.delete(input)
  }
}
