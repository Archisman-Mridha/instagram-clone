import { NotFoundException } from "@nestjs/common"
import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ProfileEntity } from "../entity"
import { ProfilePreview } from "../types"

export interface GetProfilePreviewByIDInput {
  id: number
}

export class GetProfilePreviewByIDQuery extends Query<ProfilePreview> {
  constructor(readonly input: GetProfilePreviewByIDInput) {
    super()
  }
}

@QueryHandler(GetProfilePreviewByIDQuery)
export class GetProfilePreviewByIDHandler implements IQueryHandler<GetProfilePreviewByIDQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>
  ) {}

  async execute({ input }: GetProfilePreviewByIDQuery): Promise<ProfilePreview> {
    const profilePreview = await this.profilesRepository.findOne({
      where: { id: input.id },
      select: ["id", "name", "username"]
    })
    if (!profilePreview) throw new NotFoundException()

    return profilePreview
  }
}
