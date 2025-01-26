package grpc

import (
	"context"
	"fmt"
	"log/slog"
	"net"
	"time"

	"github.com/bufbuild/protovalidate-go"
	"github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/logging"
	gRPCProtovalidateMiddleware "github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/protovalidate"
	"github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/recovery"
	"github.com/prometheus/client_golang/prometheus"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"google.golang.org/grpc"
	_ "google.golang.org/grpc/encoding/gzip"

	"google.golang.org/grpc/reflection"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/healthcheck"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logger"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	gRPCMetricsMiddleware "github.com/grpc-ecosystem/go-grpc-middleware/providers/prometheus"

	// This is necessary to avoid ambiguous import error.
	// REFER : https://github.com/open-telemetry/opentelemetry-collector/issues/10476
	_ "google.golang.org/genproto/googleapis/type/date"

	/*
	  The WASI preview 1 specification has partial support for socket networking, preventing a large
	  class of Go applications from running when compiled to WebAssembly with GOOS=wasip1. Extensions
	  to the base specifications have been implemented by runtimes to enable a wider range of
	  programs to be run as WebAssembly modules.

	  Where possible, the package offers the ability to automatically configure the network stack via
	  init functions called on package imports.

	  When imported, this package alter the default configuration to install a dialer function
	  implemented on top of the WASI socket extensions. When compiled to other targets, the import
	  of those packages does nothing.

	  REFER : https://github.com/dev-wasm/dev-wasm-go.
	*/
	_ "github.com/stealthrocket/net/http"
)

type GRPCServer struct {
	*grpc.Server
}

type NewGRPCServerArgs struct {
	DevModeEnabled bool

	HealthcheckFrequency time.Duration
	Healthcheckables     []healthcheck.Healthcheckable
}

// Creates and returns a gRPC server.
func NewGRPCServer(ctx context.Context, args NewGRPCServerArgs) *GRPCServer {
	var (
		requestLogger = NewGRPCRequestLogger(slog.Default())

		serverMetrics     = gRPCMetricsMiddleware.NewServerMetrics()
		metricsMiddleware = gRPCMetricsMiddleware.WithExemplarFromContext(ExtractExemplarFromContext)
	)

	protoValidator, err := protovalidate.New()
	assert.AssertErrNil(ctx, err, "Failed creating proto validator")

	server := grpc.NewServer(
		grpc.StatsHandler(otelgrpc.NewServerHandler()),

		grpc.ChainUnaryInterceptor(
			gRPCProtovalidateMiddleware.UnaryServerInterceptor(protoValidator),

			logging.UnaryServerInterceptor(requestLogger),
			serverMetrics.UnaryServerInterceptor(metricsMiddleware),

			recovery.UnaryServerInterceptor(recovery.WithRecoveryHandlerContext(PanicRecoveryHandler)),
		),
		grpc.ChainStreamInterceptor(
			gRPCProtovalidateMiddleware.StreamServerInterceptor(protoValidator),

			logging.StreamServerInterceptor(requestLogger),
			serverMetrics.StreamServerInterceptor(metricsMiddleware),

			recovery.StreamServerInterceptor(recovery.WithRecoveryHandlerContext(PanicRecoveryHandler)),
		),
	)

	serverMetrics.InitializeMetrics(server)
	prometheus.DefaultRegisterer.MustRegister(serverMetrics)

	if args.DevModeEnabled {
		reflection.Register(server)
	}

	SetupHealthcheck(ctx, SetupHealthcheckArgs{
		Server:               server,
		HealthcheckFrequency: args.HealthcheckFrequency,
		Healthcheckables:     args.Healthcheckables,
	})

	return &GRPCServer{server}
}

// Creates a TCP listener at the given address and uses it to run the gRPC server.
//
// Panics if any error occurs.
func (server *GRPCServer) Run(ctx context.Context, port int) error {
	address := fmt.Sprintf("0.0.0.0:%d", port)

	ctx = logger.AppendSlogAttributesToCtx(ctx, []slog.Attr{
		slog.String("address", address),
	})

	tcpListener, err := net.Listen("tcp", address)
	assert.AssertErrNil(ctx, err, "Failed creating TCP listener")

	slog.InfoContext(ctx, "Running gRPC server....")
	if err := server.Serve(tcpListener); err != nil {
		return utils.WrapError("gRPC server error occurred", err)
	}

	return nil
}

// Stops the gRPC server from accepting new connections and RPC requests.
// Then, waits for the RPCs which are currently being processed, to finish.
func (server *GRPCServer) GracefulShutdown(ctx context.Context) {
	server.GracefulStop()
	slog.InfoContext(ctx, "Shut down gRPC server")
}
