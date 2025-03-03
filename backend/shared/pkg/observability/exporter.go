package observability

import (
	"go.opentelemetry.io/otel/sdk/resource"
	"google.golang.org/grpc"
)

type NewExporterArgs struct {
	OpenTelemetryResource *resource.Resource
	GRPCClientConnection  *grpc.ClientConn
}
