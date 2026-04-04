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
