package logs

import (
	"context"
	"log/slog"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logs/logger"
	"github.com/go-logr/logr"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploggrpc"
)

type LogExporter struct {
	*otlploggrpc.Exporter
}

func NewLogExporter(ctx context.Context, args observability.NewExporterArgs) *LogExporter {
	logExporter, err := otlploggrpc.New(ctx, otlploggrpc.WithGRPCConn(args.GRPCClientConnection))
	assert.AssertErrNil(ctx, err, "Failed creating log exporter")

	otel.SetLogger(
		logr.FromSlogHandler(slog.Default().Handler()),
	)
	slog.DebugContext(ctx, "Initialized log exporter")

	return &LogExporter{logExporter}
}

// Shuts down the log exporter.
func (m *LogExporter) GracefulShutdown(ctx context.Context) {
	if err := m.Shutdown(ctx); err != nil {
		slog.ErrorContext(ctx, "Failed shutting down log exporter", logger.Error(err))
	}

	slog.DebugContext(ctx, "Shut down log exporter")
}
