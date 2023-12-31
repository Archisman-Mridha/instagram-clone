package connectors

import (
	"github.com/charmbracelet/log"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func createGrpcConnection(serviceName, address string) *grpc.ClientConn {
	connection, err := grpc.Dial(address,
															 grpc.WithTransportCredentials(insecure.NewCredentials( )),
	)
	if err != nil {
		log.Fatalf("Couldn't connect to %s at %s : %v", serviceName, address, err)}

	return connection
}