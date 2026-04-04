import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { PostEntity } from "../entity"
import { In, Repository } from "typeorm"

export interface GetPostsByIDsInput {
  ids: Array<number>
}

export interface GetPostsByIDsOutput {
  posts: Array<PostEntity>
}

export class GetPostsByIDsQuery extends Query<GetPostsByIDsOutput> {
  constructor(readonly input: GetPostsByIDsInput) {
    super()
  }
}

@QueryHandler(GetPostsByIDsQuery)
export class GetPostsByIDsHandler implements IQueryHandler<GetPostsByIDsQuery> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>
  ) {}

  async execute({ input }: GetPostsByIDsQuery): Promise<GetPostsByIDsOutput> {
    const posts = await this.postsRepository.findBy({
      id: In(input.ids)
    })

    return { posts }
  }
}
