import { PaginatedInput, PaginatedOutput } from "@instagram-clone/lib/utils/pagination"
import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FollowshipEntity } from "../entity"

export interface GetFolloweesInput extends PaginatedInput {
  followerID: number
}

export interface GetFolloweesOutput extends PaginatedOutput {
  followeeIDs: Array<number>
}

export class GetFolloweesQuery extends Query<GetFolloweesOutput> {
  constructor(readonly input: GetFolloweesInput) {
    super()
  }
}

@QueryHandler(GetFolloweesQuery)
export class GetFolloweesHandler implements IQueryHandler<GetFolloweesQuery> {
  constructor(
    @InjectRepository(FollowshipEntity)
    private readonly followshipsRepository: Repository<FollowshipEntity>
  ) {}

  async execute({ input }: GetFolloweesQuery): Promise<GetFolloweesOutput> {
    const [followships, count] = await this.followshipsRepository.findAndCount({
      where: { followerID: input.followerID },

      skip: input.skip,
      take: input.take
    })

    const followeeIDs = followships.map((followship) => followship.followeeID)

    return { count, followeeIDs }
  }
}
