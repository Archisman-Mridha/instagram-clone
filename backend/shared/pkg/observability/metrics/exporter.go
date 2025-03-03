package metrics

import (
	"context"
	"log/slog"
	"time"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logs/logger"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
	"go.opentelemetry.io/otel/sdk/metric"
)

type MetricExporter struct {
	*otlpmetricgrpc.Exporter
}

func NewMetricExporter(ctx context.Context, args observability.NewExporterArgs) *MetricExporter {
	metricExporter, err := otlpmetricgrpc.New(ctx, otlpmetricgrpc.WithGRPCConn(args.GRPCClientConnection))
	assert.AssertErrNil(ctx, err, "Failed creating metrics exporter")

	otel.SetMeterProvider(metric.NewMeterProvider(
		metric.WithResource(args.OpenTelemetryResource),

		metric.WithReader(metric.NewPeriodicReader(
			metricExporter,
			metric.WithInterval(2*time.Second),
		)),
	))
	slog.DebugContext(ctx, "Initialized metric exporter")

	return &MetricExporter{metricExporter}
}

// Flushes all unexported metrics, garcefully shutting down the metric exporter.
func (m *MetricExporter) GracefulShutdown() {
	ctx := context.Background()

	if err := m.ForceFlush(ctx); err != nil {
		slog.Error("Failed force flushing metrics")
		return
	}

	if err := m.Shutdown(ctx); err != nil {
		slog.Error("Failed shutting down metric exporter", logger.Error(err))
		return
	}

	slog.Debug("Shut down metric exporter")
}
