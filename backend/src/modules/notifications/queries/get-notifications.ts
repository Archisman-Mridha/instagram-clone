import { IQueryHandler, Query, QueryHandler } from "@nestjs/cqrs"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { MongoDBSortOrder } from "src/utils/mongodb"
import { PaginatedInput, PaginatedOutput } from "src/utils/pagination"
import { Notification } from "../schema"

export interface GetNotificationsInput extends PaginatedInput {
  userID: number
}

export interface GetNotificationsOutput extends PaginatedOutput {
  notifications: Array<Notification>
}

export class GetNotificationsQuery extends Query<GetNotificationsOutput> {
  constructor(readonly input: GetNotificationsInput) {
    super()
  }
}

@QueryHandler(GetNotificationsQuery)
export class GetNotificationsHandler implements IQueryHandler<GetNotificationsQuery> {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationsRepository: Model<Notification>
  ) {}

  async execute({ input }: GetNotificationsQuery): Promise<GetNotificationsOutput> {
    const [notifications, count] = await Promise.all([
      this.notificationsRepository
        .find({ userID: input.userID })
        .sort({ createdAt: MongoDBSortOrder.DESCENDING })
        .skip(input.skip)
        .limit(input.take),

      this.notificationsRepository.countDocuments({ userID: input.userID })
    ])

    return { notifications, count }
  }
}
