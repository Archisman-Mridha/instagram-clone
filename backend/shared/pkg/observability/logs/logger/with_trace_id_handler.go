package logger

import (
	"context"
	"log/slog"

	"go.opentelemetry.io/otel/trace"
)

type TraceAndSpanIDCtxKey struct{}

var traceAndSpanIDCtxKey = TraceAndSpanIDCtxKey{}

type TraceAndSpanIDHandler struct {
	slog.Handler
}

// Retrieves the tracea and span IDs (if present in the context) and appends it to the slog record
// (log event).
// The slog handler is then invoked with the modified record.
func (h *TraceAndSpanIDHandler) Handle(ctx context.Context, record slog.Record) error {
	if trace.SpanContextFromContext(ctx).HasTraceID() {
		traceID := trace.SpanContextFromContext(ctx).TraceID().String()
		record.AddAttrs(slog.String("trace", traceID))
	}

	if trace.SpanContextFromContext(ctx).HasSpanID() {
		spanID := trace.SpanContextFromContext(ctx).SpanID().String()
		record.AddAttrs(slog.String("span", spanID))
	}

	return h.Handler.Handle(ctx, record)
}

func withTraceAndSpanIDHandler(handler slog.Handler) *TraceAndSpanIDHandler {
	return &TraceAndSpanIDHandler{
		handler,
	}
}
