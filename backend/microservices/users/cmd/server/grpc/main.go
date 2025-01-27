package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/cmd/server/grpc/api"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/cmd/server/grpc/api/proto/generated"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/config"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/constants"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/grpc"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/healthcheck"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logger"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/metrics"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/tracer"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/versioning"
	"golang.org/x/sync/errgroup"
)

func main() {
	// When the program receives any interruption / SIGKILL / SIGTERM signal, the cancel function is
	// automatically invoked. The cancel function is responsible for freeing all the resources
	// associated with the context.
	ctx, cancel := signal.NotifyContext(context.Background(),
		syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT,
	)
	defer cancel()

	configFilePath := utils.GetEnv(constants.ENV_CONFIG_FILE)
	config := utils.MustParseConfigFile[config.Config](ctx, configFilePath)

	if err := run(ctx, config); err != nil {
		slog.ErrorContext(ctx, err.Error())

		cancel()

		// Give some time for remaining resources (if any) to be cleaned up.
		time.Sleep(constants.RESOURCES_CLEANUP_TIMEOUT)

		os.Exit(1)
	}
}

func run(ctx context.Context, config *config.Config) error {
	logger.SetupLogger(config.DebugLogging, config.DevMode)

	metricsServer := metrics.NewMetricsServer(config.HTTPMetricsServerPort)

	traceExporter := tracer.SetupTraceExporter(ctx, tracer.SetupTraceExporterArgs{
		ServiceName:    constants.SERVICE_NAME,
		ServiceVersion: constants.SERVICE_VERSION,

		TraceCollectorEndpoint: config.JaegerURL,
	})
	defer traceExporter.GracefulShutdown(ctx)

	openFeatureClient := versioning.GetOpenFeatureClient(ctx, config.FlagsmithAPIKey,
		constants.SERVICE_NAME,
	)
	_ = openFeatureClient

	waitGroup, ctx := errgroup.WithContext(ctx)

	// Run gRPC server.
	{
		gRPCServer := grpc.NewGRPCServer(ctx, grpc.NewGRPCServerArgs{
			DevModeEnabled: config.DevMode,

			HealthcheckFrequency: constants.HEALTHCHECK_FREQUENCY,
			Healthcheckables:     []healthcheck.Healthcheckable{},
		})

		generated.RegisterUsersServiceServer(gRPCServer, &api.GRPCAPI{})

		waitGroup.Go(func() error {
			return gRPCServer.Run(ctx, config.GRPCServerPort)
		})
		defer gRPCServer.GracefulShutdown(ctx)
	}

	// Run HTTP metrics server.
	waitGroup.Go(func() error {
		return metricsServer.Run(ctx)
	})
	defer metricsServer.GracefulShutdown(ctx)

	/*
		The returned channel gets closed when either of this happens :

			(1) A program termination signal is received, because of which the parent context's done
				  channel gets closed.

			(2) Any of the go-routines registered under the wait-group, finishes running.
	*/
	<-ctx.Done()
	slog.InfoContext(ctx, "Gracefully shutting down program....")

	return waitGroup.Wait()
}
