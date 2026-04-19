import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FollowshipEntity } from "../entity"

export interface GetFollowshipCountsInput {
  profileID: number
}

export interface GetFollowshipCountsOutput {
  followerCount: number
  followeeCount: number
}

export class GetFollowshipCountsQuery extends Query<GetFollowshipCountsOutput> {
  constructor(readonly input: GetFollowshipCountsInput) {
    super()
  }
}

@QueryHandler(GetFollowshipCountsQuery)
export class GetFollowshipCountsHandler implements IQueryHandler<GetFollowshipCountsQuery> {
  constructor(
    @InjectRepository(FollowshipEntity)
    private readonly followshipsRepository: Repository<FollowshipEntity>
  ) {}

  async execute({ input }: GetFollowshipCountsQuery): Promise<GetFollowshipCountsOutput> {
    const [followerCount, followeeCount] = await Promise.all([
      this.followshipsRepository.count({ where: { followeeID: input.profileID } }),
      this.followshipsRepository.count({ where: { followerID: input.profileID } })
    ])

    return { followerCount, followeeCount }
  }
}
