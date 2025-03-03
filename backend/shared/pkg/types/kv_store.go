package types

import (
	"context"
	"time"
)

type KVStore interface {
	// Set key to hold the string value. If key already holds a value, it is overwritten, regardless
	// of its type. Any previous time to live associated with the key is discarded on successful SET
	// operation.
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error

	// Get the value of key. An error is returned if the value stored at key is not a string,
	// because GET only handles string values.
	Get(ctx context.Context, key string) (string, error)

	// Removes the specified keys. A key is ignored if it does not exist.
	Del(ctx context.Context, keys ...string) error
}
