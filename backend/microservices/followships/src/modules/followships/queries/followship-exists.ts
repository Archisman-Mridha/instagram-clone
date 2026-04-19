import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FollowshipEntity } from "../entity"

export interface FollowshipExistsInput {
  followerID: number
  followeeID: number
}

export class FollowshipExistsQuery extends Query<boolean> {
  constructor(readonly input: FollowshipExistsInput) {
    super()
  }
}

@QueryHandler(FollowshipExistsQuery)
export class FollowshipExistsHandler implements IQueryHandler<FollowshipExistsQuery> {
  constructor(
    @InjectRepository(FollowshipEntity)
    private readonly followshipsRepository: Repository<FollowshipEntity>
  ) {}

  async execute({ input }: FollowshipExistsQuery): Promise<boolean> {
    return this.followshipsRepository.exists({
      where: { followerID: input.followerID, followeeID: input.followeeID }
    })
  }
}
