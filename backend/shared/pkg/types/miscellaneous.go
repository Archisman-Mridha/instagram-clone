package types

type (
	ID = int32

	PaginationArgs struct {
		Offset,
		PageSize uint64
	}
)
