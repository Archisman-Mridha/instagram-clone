import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ElasticsearchService } from "@nestjs/elasticsearch"
import { ElasticsearchIndex } from "src/utils/elasticsearch"
import { ProfileEntity } from "../entity"
import { ProfileDocument } from "../types"

export class IndexProfileCommand extends Command<void> {
  constructor(readonly input: ProfileEntity) {
    super()
  }
}

@CommandHandler(IndexProfileCommand)
export class IndexProfileHandler implements ICommandHandler<IndexProfileCommand> {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async execute({ input }: IndexProfileCommand): Promise<void> {
    await this.elasticsearchService.index<ProfileDocument>({
      index: ElasticsearchIndex.PROFILES,
      id: input.id.toString(),
      document: input
    })
  }
}
