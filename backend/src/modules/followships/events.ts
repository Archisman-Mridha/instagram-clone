import { CDC } from "src/utils/event"
import { FollowshipEntity } from "./entity"

export class FollowshipCreatedEvent extends CDC.CreatedEvent<FollowshipEntity> {}
