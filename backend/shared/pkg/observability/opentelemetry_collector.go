package observability

import (
	"context"
	"log/slog"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logs/logger"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type OpenTelemetryCollectorClient struct {
	connection *grpc.ClientConn
}

func NewOpenTelemetryCollectorClient(ctx context.Context, url string) *OpenTelemetryCollectorClient {
	connection, err := grpc.NewClient(url,
		grpc.WithCompressor(grpc.NewGZIPCompressor()),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	assert.AssertErrNil(ctx, err, "Failed creating gRPC client")

	slog.DebugContext(ctx, "Created OpenTelemetry Collector gRPC client")

	return &OpenTelemetryCollectorClient{connection}
}

func (o *OpenTelemetryCollectorClient) GetConnection() *grpc.ClientConn {
	return o.connection
}

func (o *OpenTelemetryCollectorClient) Shutdown() {
	if err := o.connection.Close(); err != nil {
		slog.Error("Failed shutting down OpenTelemetry Collector gRPC client", logger.Error(err))
		return
	}

	slog.Debug("Shut down OpenTelemetry Collector gRPC client")
}
