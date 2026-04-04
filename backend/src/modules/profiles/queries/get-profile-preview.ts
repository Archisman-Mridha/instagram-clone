import { NotFoundException } from "@nestjs/common"
import { QueryHandler, IQueryHandler, Query } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ProfileEntity } from "../entity"
import { ProfilePreview } from "../types"

export interface GetProfilePreviewInput {
  profileID: number
}

export class GetProfilePreviewQuery extends Query<ProfilePreview> {
  constructor(readonly input: GetProfilePreviewInput) {
    super()
  }
}

@QueryHandler(GetProfilePreviewQuery)
export class GetProfilePreviewHandler implements IQueryHandler<GetProfilePreviewQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>
  ) {}

  async execute({ input }: GetProfilePreviewQuery): Promise<ProfilePreview> {
    const profilePreview = await this.profilesRepository.findOne({
      where: { id: input.profileID },
      select: ["id", "name", "username"]
    })

    if (!profilePreview) throw new NotFoundException()

    return profilePreview
  }
}
