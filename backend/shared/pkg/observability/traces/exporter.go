package traces

import (
	"context"
	"log/slog"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logs/logger"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/trace"
)

type TraceExporter struct {
	*otlptrace.Exporter
}

func NewTraceExporter(ctx context.Context, args observability.NewExporterArgs) *TraceExporter {
	traceExporter, err := otlptracegrpc.New(ctx, otlptracegrpc.WithGRPCConn(args.GRPCClientConnection))
	assert.AssertErrNil(ctx, err, "Failed creating trace exporter")

	otel.SetTracerProvider(trace.NewTracerProvider(
		trace.WithResource(args.OpenTelemetryResource),
		trace.WithBatcher(traceExporter),
		trace.WithSampler(trace.AlwaysSample()),
	))

	// Text map propagators are responsible for extracting and injecting trace context information
	// into carrier objects, such as HTTP headers or other transport-specific metadata.
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		// Trace context is a standardized format for representing trace and span information. It
		// includes trace-id, span-id, trace state etc.
		propagation.TraceContext{},

		// Baggage is a mechanism for carrying key-value pairs along with the trace context. These
		// key-value pairs are known as baggage items. Baggage allows you to attach custom data to a
		// request, which will be propagated along with the trace context.
		propagation.Baggage{},
	))

	slog.DebugContext(ctx, "Initialized trace exporter")

	return &TraceExporter{traceExporter}
}

// Shuts down the trace exporter.
func (t *TraceExporter) GracefulShutdown() {
	err := t.Shutdown(context.Background())
	if err != nil {
		slog.Error("Failed shutting down trace exporter", logger.Error(err))
		return
	}

	slog.Debug("Shut down trace exporter")
}
