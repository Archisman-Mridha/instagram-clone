package logger

import (
	"context"
	"log/slog"

	"go.opentelemetry.io/otel/trace"
)

type TraceIDCtxKey struct{}

var traceIDCtxKey = TraceIDCtxKey{}

type TraceIDHandler struct {
	slog.Handler
}

// Retrieves the trace-id (if present in the context) and appends it to the slog record (log event).
// The slog handler is then invoked with the modified record.
func (h *TraceIDHandler) Handle(ctx context.Context, record slog.Record) error {
	if trace.SpanContextFromContext(ctx).HasTraceID() {
		traceID := trace.SpanContextFromContext(ctx).TraceID().String()
		record.AddAttrs(slog.String("trace", traceID))
	}

	return h.Handler.Handle(ctx, record)
}

func withTraceIDHandler(handler slog.Handler) *TraceIDHandler {
	return &TraceIDHandler{
		handler,
	}
}
