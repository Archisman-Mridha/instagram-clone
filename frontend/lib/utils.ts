export type Result<Ok> = { Ok: Ok; Err?: string } | { Ok?: Ok; Err: string }

export const ServerErrorMessage = "server error occurred"
