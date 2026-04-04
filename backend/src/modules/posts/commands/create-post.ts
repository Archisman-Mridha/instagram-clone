import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { PostEntity } from "../entity"

export interface CreatePostInput {
  authorID: number
  imageURL: string
  decription?: string
}

export interface CreatePostOutput {
  id: number
}

export class CreatePostCommand extends Command<CreatePostOutput> {
  constructor(readonly input: CreatePostInput) {
    super()
  }
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>
  ) {}

  async execute({ input }: CreatePostCommand): Promise<CreatePostOutput> {
    let post = this.postsRepository.create(input)
    post = await this.postsRepository.save(post)

    return { id: post.id }
  }
}
