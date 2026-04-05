import { NotFoundException } from "@nestjs/common"
import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ProfileEntity } from "../entity"

export interface GetProfileByIDInput {
  id: number
}

export class GetProfileByIDQuery extends Query<ProfileEntity> {
  constructor(readonly input: GetProfileByIDInput) {
    super()
  }
}

@QueryHandler(GetProfileByIDQuery)
export class GetProfileByIDHandler implements IQueryHandler<GetProfileByIDQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>
  ) {}

  async execute({ input }: GetProfileByIDQuery): Promise<ProfileEntity> {
    const profile = await this.profilesRepository.findOne({
      where: { id: input.id }
    })
    if (!profile) throw new NotFoundException()

    return profile
  }
}
