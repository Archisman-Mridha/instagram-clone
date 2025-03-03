package grpc

import (
	"context"
	"log/slog"
	"runtime/debug"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logs/logger"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/metrics"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/logging"
	"github.com/prometheus/client_golang/prometheus"
	"go.opentelemetry.io/otel/trace"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Returns a gRPC request logger (which under the hood invokes slog).
// TODO : Filter out critical fields (like password).
func newGRPCRequestLogger(slogLogger *slog.Logger) logging.Logger {
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
func panicRecoveryHandler(ctx context.Context, panic any) error {
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
func extractExemplarFromContext(ctx context.Context) prometheus.Labels {
	if span := trace.SpanContextFromContext(ctx); span.IsSampled() {
		return prometheus.Labels{"trace_id": span.TraceID().String()}
	}
	return nil
}

// Constructs and returns unary server interceptor for error handling.
// The error handler interceptor converts any error (returned from the usecases layer) to gRPC
// specific error.
func errorHandlerUnaryServerInterceptor(
	toGRPCErrorStatusCodeFn ToGRPCErrorStatusCodeFn,
) grpc.UnaryServerInterceptor {
	return func(ctx context.Context,
		request any,
		_ *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (any, error) {
		response, err := handler(ctx, request)
		return response, toGRPCError(ctx, err, toGRPCErrorStatusCodeFn)
	}
}

// Constructs and returns stream server interceptor for error handling.
// The error handler interceptor converts any error (returned from the usecases layer) to gRPC
// specific error.
func errorHandlerStreamServerInterceptor(
	toGRPCErrorStatusCodeFn ToGRPCErrorStatusCodeFn,
) grpc.StreamServerInterceptor {
	return func(
		server any,
		stream grpc.ServerStream,
		_ *grpc.StreamServerInfo,
		handler grpc.StreamHandler,
	) error {
		err := handler(server, stream)
		return toGRPCError(stream.Context(), err, toGRPCErrorStatusCodeFn)
	}
}

// Converts any error (returned from the usecases layer) to gRPC specific error.
// If the error is unexpected (not of type APIError), then that gets logged.
func toGRPCError(ctx context.Context,
	err error,
	toGRPCErrorStatusCodeFn ToGRPCErrorStatusCodeFn,
) error {
	switch err.(type) {
	case sharedUtils.APIError:
		return status.Error(toGRPCErrorStatusCodeFn(err), err.Error())

	default:
		// Log unexpected error.
		slog.ErrorContext(ctx, "Unexpected error occurred", logger.Error(err))

		return status.Error(codes.Internal, sharedUtils.ErrInternalServer.Error())
	}
}
