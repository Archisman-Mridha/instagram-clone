import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { ProfilePreview } from "../types"
import { ProfileEntity } from "../entity"

export interface GetProfilePreviewsByIDsInput {
  ids: Array<number>
}

export interface GetProfilePreviewsByIDsOutput {
  profilePreviews: Array<ProfilePreview>
}

export class GetProfilePreviewsByIDsQuery extends Query<GetProfilePreviewsByIDsOutput> {
  constructor(readonly input: GetProfilePreviewsByIDsInput) {
    super()
  }
}

@QueryHandler(GetProfilePreviewsByIDsQuery)
export class GetProfilePreviewsByIDsHandler implements IQueryHandler<GetProfilePreviewsByIDsQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilesRepository: Repository<ProfileEntity>
  ) {}

  async execute({ input }: GetProfilePreviewsByIDsQuery): Promise<GetProfilePreviewsByIDsOutput> {
    const profilePreviews = await this.profilesRepository.find({
      where: { id: In(input.ids) },
      select: ["id", "name", "username"]
    })
    return { profilePreviews }
  }
}
