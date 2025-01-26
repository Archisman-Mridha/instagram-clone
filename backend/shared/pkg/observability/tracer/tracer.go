package tracer

import (
	"context"
	"log/slog"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logger"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.27.0"
	"google.golang.org/grpc/encoding/gzip"
)

type TraceExporter struct {
	*otlptrace.Exporter
}

type SetupTraceExporterArgs struct {
	ServiceName,
	ServiceVersion string

	TraceCollectorEndpoint string
}

// Sets up the trace exporter.
func SetupTraceExporter(ctx context.Context, args SetupTraceExporterArgs) *TraceExporter {
	resource, err := resource.New(ctx,
		resource.WithSchemaURL(semconv.SchemaURL),

		resource.WithAttributes(
			semconv.ServiceName(args.ServiceName),
			semconv.ServiceVersion(args.ServiceVersion),
		),

		resource.WithProcessRuntimeName(),
		resource.WithProcessRuntimeVersion(),

		resource.WithContainer(),
		resource.WithHost(),
	)
	assert.AssertErrNil(ctx, err, "Failed creating OpenTelemetry resource")

	traceExporter, err := otlptracegrpc.New(ctx,
		otlptracegrpc.WithCompressor(gzip.Name),
		otlptracegrpc.WithEndpoint(args.TraceCollectorEndpoint),
	)
	assert.AssertErrNil(ctx, err, "Failed creating trace exporter")

	otel.SetTracerProvider(trace.NewTracerProvider(
		trace.WithResource(resource),
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

	return &TraceExporter{traceExporter}
}

// Shuts down the trace exporter.
func (traceExporter *TraceExporter) GracefulShutdown(ctx context.Context) {
	if err := traceExporter.Shutdown(ctx); err != nil {
		slog.ErrorContext(ctx, "Failed shutting down trace exporter", logger.Error(err))
	}

	slog.InfoContext(ctx, "Shut down trace exporter")
}
