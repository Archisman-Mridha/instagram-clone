package utils

import (
	"time"

	"golang.org/x/sync/errgroup"
)

// RunFnPeriodically runs a given funcion (in a separate go-routine) periodically with the given
// time period. It also takes the 'done' channel as an input. Before exitting the program, close the
// done channel to cleanup resources.
func RunFnPeriodically[T interface{}](waitGroup *errgroup.Group, fn func(T), fnArgs T, period time.Duration) {
	waitGroup.Go(func() error {
		ticker := time.NewTicker(period)
		defer ticker.Stop()

		for range ticker.C {
			fn(fnArgs)
		}

		return nil
	})
}
