package utils

import "errors"

var (
	ErrUnauthenticated = errors.New("user is unauthenticated")

	ErrUnexpected = errors.New("server error occurred")
)
