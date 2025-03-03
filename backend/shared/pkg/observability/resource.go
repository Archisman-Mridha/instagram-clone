package observability

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
)

// Creates and returns an OpenTelemetry resource representing the given service.
func NewOpenTelemetryResource(ctx context.Context, serviceName, serviceVersion string) *resource.Resource {
	resource, err := resource.New(ctx,
		resource.WithSchemaURL(semconv.SchemaURL),

		resource.WithAttributes(
			semconv.ServiceName(serviceName),
			semconv.ServiceVersion(serviceVersion),
		),

		resource.WithProcessRuntimeName(),
		resource.WithProcessRuntimeVersion(),

		resource.WithContainer(),
		resource.WithHost(),
	)
	assert.AssertErrNil(ctx, err, "Failed creating OpenTelemetry resource")

	return resource
}
