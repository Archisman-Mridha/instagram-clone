import { CDC } from "src/utils/event"
import { UserEntity } from "./entity"

export class UserCreatedEvent extends CDC.CreatedEvent<UserEntity> {}
