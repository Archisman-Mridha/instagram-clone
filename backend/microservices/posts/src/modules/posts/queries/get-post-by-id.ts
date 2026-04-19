import { NotFoundException } from "@nestjs/common"
import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { PostEntity } from "../entity"

export interface GetPostByIDInput {
  id: number
}

export class GetPostByIDQuery extends Query<PostEntity> {
  constructor(readonly input: GetPostByIDInput) {
    super()
  }
}

@QueryHandler(GetPostByIDQuery)
export class GetPostByIDHandler implements IQueryHandler<GetPostByIDQuery> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>
  ) {}

  async execute({ input }: GetPostByIDQuery): Promise<PostEntity> {
    const post = await this.postsRepository.findOne({
      where: { id: input.id }
    })
    if (!post) throw new NotFoundException("Post not found")

    return post
  }
}
