import { UserEntity } from "@instagram-clone/microservices/auth/modules/users/entity"
import { ProfileEntity } from "@instagram-clone/microservices/profiles/modules/profiles/entity"

export namespace CDC {
  export enum Operation {
    Create = "c",
    Update = "u",
    Delete = "d"
  }

  export type Event<Row> = CreatedEvent<Row> | UpdatedEvent<Row> | DeletedEvent<Row>

  export class CreatedEvent<Row> {
    payload: {
      after: Row
    }
  }

  export class UpdatedEvent<Row> {
    payload: {
      before: Row
      after: Row
    }
  }

  export class DeletedEvent<Row> {
    payload: {
      before: Row
    }
  }
}

export class UserCreatedEvent extends CDC.CreatedEvent<UserEntity> {}

export class ProfileCreatedEvent extends CDC.CreatedEvent<ProfileEntity> {}
