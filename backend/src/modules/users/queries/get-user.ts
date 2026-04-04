import { UnauthorizedException } from "@nestjs/common"
import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOneOptions, Repository } from "typeorm"
import { UserEntity } from "../entity"

export class GetUserQuery extends Query<UserEntity> {
  constructor(public readonly query: FindOneOptions<UserEntity>) {
    super()
  }
}

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  async execute(query: GetUserQuery): Promise<UserEntity> {
    const user = await this.usersRepository.findOne(query.query)
    if (!user) throw new UnauthorizedException("user not found")

    return user
  }
}
