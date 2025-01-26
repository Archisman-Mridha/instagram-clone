package metrics

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logger"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"

	/*
	  The WASI preview 1 specification has partial support for socket networking, preventing a large
	  class of Go applications from running when compiled to WebAssembly with GOOS=wasip1. Extensions
	  to the base specifications have been implemented by runtimes to enable a wider range of
	  programs to be run as WebAssembly modules.

	  Where possible, the package offers the ability to automatically configure the network stack via
	  init functions called on package imports.

	  When imported, this package alter the default configuration to install a dialer function
	  implemented on top of the WASI socket extensions. When compiled to other targets, the import
	  of those packages does nothing.

	  REFER : https://github.com/dev-wasm/dev-wasm-go.
	*/
	_ "github.com/stealthrocket/net/http"
)

type MetricsServer struct {
	*http.Server
}

// Creates and returns an HTTP metrics server.
// The global Prometheus registry gets initialized here.
func NewMetricsServer(port int) *MetricsServer {
	server := &http.Server{
		Addr: fmt.Sprintf("0.0.0.0:%d", port),
	}

	http.Handle("/metrics",
		promhttp.HandlerFor(prometheus.DefaultGatherer, promhttp.HandlerOpts{
			EnableOpenMetrics: true,
		}),
	)

	return &MetricsServer{server}
}

// Runs the HTTP metrics server.
func (m *MetricsServer) Run(ctx context.Context) error {
	slog.InfoContext(ctx, "Running HTTP metrics server....", slog.String("address", m.Addr))
	if err := m.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		return utils.WrapError("HTTP metrics server error occurred", err)
	}

	return nil
}

// Tries to shut down the HTTP metrics server.
func (m *MetricsServer) GracefulShutdown(ctx context.Context) {
	if err := m.Close(); err != nil {
		slog.ErrorContext(ctx, "Failed shutting down HTTP metrics server", logger.Error(err))
	}

	slog.InfoContext(ctx, "Shut down HTTP metrics server")
}
