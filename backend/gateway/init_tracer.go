package main

import (
	"context"

	"github.com/charmbracelet/log"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.21.0"

	"github.com/Archisman-Mridha/instagram-clone/backend/gateway/utils"
)

// startTracer initializes and returns a trace.TracerProvider for OpenTelemetry.
func startTracer( ) *trace.TracerProvider {
	traceExporter, err := otlptracegrpc.New(context.Background( ),
		otlptracegrpc.WithEndpoint(utils.Envs.JAEGER_COLLECTOR_URL),
		otlptracegrpc.WithCompressor("gzip"),
		otlptracegrpc.WithInsecure( ),
	)
	if err != nil {
		log.Fatalf("Error creating trace exporter : %v", err)}

	tracerProvider := trace.NewTracerProvider(
		trace.WithBatcher(traceExporter),

		trace.WithResource(resource.NewWithAttributes(semconv.SchemaURL,
			semconv.ServiceName("gateway"),
		)),
	)

	otel.SetTracerProvider(tracerProvider)

	// Text map propagators are responsible for extracting and injecting trace context information
	// into carrier objects, such as HTTP headers or other transport-specific metadata.
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(

		// Trace context is a standardized format for representing trace and span information. It
		// includes trace-id, span-id, trace state etc.
		propagation.TraceContext{ },

		// Baggage is a mechanism for carrying key-value pairs along with the trace context. These
		// key-value pairs are known as baggage items. Baggage allows you to attach custom data to a
		// request, and this data will be propagated along with the trace context.
		propagation.Baggage{ },
	))

	log.Debug("Created OpenTelemetry tracer provider")

	return tracerProvider
}