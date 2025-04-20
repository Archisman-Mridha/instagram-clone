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

	// Methods related to Streams.
	/*
		A Redis stream is a data structure that acts like an append-only log but also implements several
		operations to overcome some of the limits of a typical append-only log. These include random
		access in O(1) time and complex consumption strategies, such as consumer groups. You can use
		streams to record and simultaneously syndicate events in real time.
	*/

	// Returns the specified elements of the list stored at key. The offsets start and stop are
	// zero-based indexes. These offsets can also be negative numbers indicating offsets starting at
	// the end of the list.
	LRange(ctx context.Context, key string, start, stop int64) ([]string, error)
}
