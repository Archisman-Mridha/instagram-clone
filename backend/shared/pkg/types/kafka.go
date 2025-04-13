package types

type (
	DBEvent struct {
		Payload DBEventPayload `json:"payload"`
	}

	DBEventPayload struct {
		Operation string `json:"op"`
		Before    []byte `json:"before"`
		After     []byte `json:"after"`
	}
)
