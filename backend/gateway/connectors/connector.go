package connectors

import (
	"github.com/charmbracelet/log"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type Connector interface {
	Healthcheck() error

	Disconnect()
}

func createGrpcConnection(serviceName, address string) *grpc.ClientConn {
	connection, err := grpc.Dial(address,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithStatsHandler(otelgrpc.NewClientHandler()),
	)
	if err != nil {
		log.Fatalf("Couldn't connect to %s at %s : %v", serviceName, address, err)
	}

	return connection
}
