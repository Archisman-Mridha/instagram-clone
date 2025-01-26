package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

// Counters.
var (
	PanicRecoveryCounter = promauto.NewCounter(prometheus.CounterOpts{
		Name: "panic_recoveries_total",
		Help: "Total number of panic recoveries",
	})
)
