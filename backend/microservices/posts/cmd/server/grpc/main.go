package main

import (
	"context"
	"flag"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/cmd/server/grpc/api"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/cmd/server/grpc/api/proto/generated"
	postgres "github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/adapters/repositories/posts"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/config"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/constants"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/core/usecases"
	version "github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/version"
	gRPCUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/grpc"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/healthcheck"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logs/logger"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/metrics"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/traces"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/go-playground/validator/v10"

	"golang.org/x/sync/errgroup"
)

var configFilePath string

func main() {
	// When the program receives any interruption / SIGKILL / SIGTERM signal, the cancel function is
	// automatically invoked. The cancel function is responsible for freeing all the resources
	// associated with the context.
	ctx, cancel := signal.NotifyContext(context.Background(),
		syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT,
	)
	defer cancel()

	validator := sharedUtils.NewValidator(ctx)

	// Get CLI flag values.
	{
		flagSet := flag.NewFlagSet("", flag.ExitOnError)

		flagSet.StringVar(&configFilePath, constants.FLAG_CONFIG_FILE, constants.FLAG_CONFIG_FILE_DEFAULT,
			"Config file path",
		)

		flagSet.VisitAll(sharedUtils.CreateGetFlagOrEnvValueFn(""))

		cmdArgs := os.Args[1:]
		if err := flagSet.Parse(cmdArgs); err != nil {
			slog.Error("Failed parsing command line flags", logger.Error(err))
			os.Exit(1)
		}
	}

	// Get config.
	config := sharedUtils.MustParseConfigFile[config.Config](ctx, configFilePath, validator)

	if err := run(ctx, config, validator); err != nil {
		slog.ErrorContext(ctx, err.Error())

		cancel()

		// Give some time for remaining resources (if any) to be cleaned up.
		time.Sleep(constants.RESOURCES_CLEANUP_TIMEOUT)

		os.Exit(1)
	}
}

func run(ctx context.Context, config *config.Config, validator *validator.Validate) error {
	waitGroup, ctx := errgroup.WithContext(ctx)

	// Setup observability.

	logger.SetupLogger(config.DebugLogging, config.DevMode)

	openTelemetryResource := observability.NewOpenTelemetryResource(ctx,
		constants.SERVICE_NAME, version.Version,
	)

	openTelemetryCollectorClient := observability.NewOpenTelemetryCollectorClient(ctx,
		config.OpenTelemetryCollectrURL,
	)

	exporterArgs := observability.NewExporterArgs{
		OpenTelemetryResource: openTelemetryResource,
		GRPCClientConnection:  openTelemetryCollectorClient.GetConnection(),
	}

	metricExporter := metrics.NewMetricExporter(ctx, exporterArgs)

	traceExporter := traces.NewTraceExporter(ctx, exporterArgs)

	// Setup feature flagging.
	_ = sharedUtils.GetOpenFeatureClient(ctx, &config.Flagsmith)

	// Construct the usecases layer.

	postsRepositoryAdapter := postgres.NewpostsRepositoryAdapter(ctx, &config.Postgres)

	usecases := usecases.NewUsecases(
		validator,
		postsRepositoryAdapter,
	)

	// Run gRPC server.

	gRPCServer := gRPCUtils.NewGRPCServer(ctx, gRPCUtils.NewGRPCServerArgs{
		DevModeEnabled: config.DevMode,

		Healthcheckables: []healthcheck.Healthcheckable{
			postsRepositoryAdapter,
		},

		ToGRPCErrorStatusCodeFn: getGRPCErrorStatusCode,
	})
	generated.RegisterPostsServiceServer(gRPCServer, api.NewGRPCAPI(usecases))

	waitGroup.Go(func() error {
		return gRPCServer.Run(ctx, config.ServerPort)
	})

	/*
		The returned channel gets closed when either of this happens :

			(1) A program termination signal is received, because of which the parent context's done
				  channel gets closed.

			(2) Any of the go-routines registered under the wait-group, finishes running.
	*/
	<-ctx.Done()
	slog.DebugContext(ctx, "Gracefully shutting down program....")

	// Gracefull shutdown.

	// The gRPC server must be gracefully shutdown first, so that the server finishes ongoing
	// processing of requests and returns back response.
	gRPCServer.GracefulShutdown()

	postsRepositoryAdapter.Shutdown()

	traceExporter.GracefulShutdown()
	metricExporter.GracefulShutdown()
	openTelemetryCollectorClient.Shutdown()

	return waitGroup.Wait()
}
