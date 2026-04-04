import { CDC } from "src/utils/event"
import { ProfileEntity } from "./entity"

export class ProfileCreatedEvent extends CDC.CreatedEvent<ProfileEntity> {}
