export type Result<Ok, Err extends Error = Error> =
	| { Ok: Ok, Err?: Err }
	| { Ok?: Ok, Err: Err }