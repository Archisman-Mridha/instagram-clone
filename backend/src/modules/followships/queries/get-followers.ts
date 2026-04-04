import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { Repository } from "typeorm"
import { FollowshipEntity } from "../entity"

export interface GetFollowersInput extends PaginatedInput {
  followeeID: number
}

export interface GetFollowersOutput extends PaginatedOutput {
  followerIDs: Array<number>
}

export class GetFollowersQuery extends Query<GetFollowersOutput> {
  constructor(readonly input: GetFollowersInput) {
    super()
  }
}

@QueryHandler(GetFollowersQuery)
export class GetFollowersHandler implements IQueryHandler<GetFollowersQuery> {
  constructor(
    @InjectRepository(FollowshipEntity)
    private readonly followshipsRepository: Repository<FollowshipEntity>
  ) {}

  async execute({ input }: GetFollowersQuery): Promise<GetFollowersOutput> {
    const [followships, count] = await this.followshipsRepository.findAndCount({
      where: { followeeID: input.followeeID },

      skip: input.skip,
      take: input.take
    })

    const followerIDs = followships.map((followship) => followship.followerID)

    return { count, followerIDs }
  }
}
