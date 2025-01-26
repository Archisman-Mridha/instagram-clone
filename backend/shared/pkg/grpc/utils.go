package grpc

import (
	"context"
	"log/slog"
	"runtime/debug"
	"time"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/healthcheck"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logger"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/metrics"
	"github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/logging"
	"github.com/prometheus/client_golang/prometheus"
	"go.opentelemetry.io/otel/trace"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/health"
	"google.golang.org/grpc/health/grpc_health_v1"
	"google.golang.org/grpc/status"
)

// Returns a gRPC request logger (which under the hood invokes slog).
func NewGRPCRequestLogger(slogLogger *slog.Logger) logging.Logger {
	return logging.LoggerFunc(
		func(ctx context.Context, logLevel logging.Level, message string, fields ...any) {
			slogLogger.Log(ctx, slog.Level(logLevel), message, fields...)
		},
	)
}

// This function is invoked when any panic occurs while processing a gRPC request.
// Logs about the panic recovery and increments the corresponding metric counter.
//
// In theory, this function should never be invoked, since we never panic inside a gRPC request
// handler.
func PanicRecoveryHandler(ctx context.Context, panic any) error {
	// Increment corresponding metric counter.
	metrics.PanicRecoveryCounter.Add(1)

	// Generate log.
	slog.ErrorContext(ctx,
		"Recovered from panic",
		slog.Any("panic", panic), slog.Any("stack-trace", debug.Stack()),
	)

	return status.Errorf(codes.Internal, "%s", panic)
}

// Returns a Prometheus label representing the trace-id extracted from the context, if the
// corresponding span is being sampled.
func ExtractExemplarFromContext(ctx context.Context) prometheus.Labels {
	if span := trace.SpanContextFromContext(ctx); span.IsSampled() {
		return prometheus.Labels{"trace-id": span.TraceID().String()}
	}
	return nil
}

type SetupHealthcheckArgs struct {
	Server               *grpc.Server
	HealthcheckFrequency time.Duration
	Healthcheckables     []healthcheck.Healthcheckable
}

// Sets up a healthcheck service for the given gRPC server.
// In a separate go-routine, periodically, health check is performed for each of the given health
// checkable entities. If health check fails for any of them, then the gRPC server status is set to
// `not serving`.
func SetupHealthcheck(ctx context.Context, args SetupHealthcheckArgs) {
	healthcheckServer := health.NewServer()
	grpc_health_v1.RegisterHealthServer(args.Server, healthcheckServer)

	go func() {
		var healthStatus grpc_health_v1.HealthCheckResponse_ServingStatus

		for {
			if err := healthcheck.Healthcheck(args.Healthcheckables); err != nil {
				healthStatus = grpc_health_v1.HealthCheckResponse_NOT_SERVING
				slog.ErrorContext(ctx, "Healthcheck failed", logger.Error(err))
			} else {
				healthStatus = grpc_health_v1.HealthCheckResponse_SERVING
			}

			healthcheckServer.SetServingStatus("", healthStatus)

			time.Sleep(args.HealthcheckFrequency)
		}
	}()
}
