import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { Repository } from "typeorm"
import { PostEntity } from "../entity"

export interface GetPostsByAuthorInput extends PaginatedInput {
  authorID: number
}

export interface GetPostsByAuthorOutput extends PaginatedOutput {
  posts: Array<PostEntity>
}

export class GetPostsByAuthorQuery extends Query<GetPostsByAuthorOutput> {
  constructor(readonly input: GetPostsByAuthorInput) {
    super()
  }
}

@QueryHandler(GetPostsByAuthorQuery)
export class GetPostsByAuthorHandler implements IQueryHandler<GetPostsByAuthorQuery> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>
  ) {}

  async execute({ input }: GetPostsByAuthorQuery): Promise<GetPostsByAuthorOutput> {
    const [posts, count] = await this.postsRepository.findAndCount({
      where: { authorID: input.authorID },

      skip: input.skip,
      take: input.take
    })

    return { posts, count }
  }
}
