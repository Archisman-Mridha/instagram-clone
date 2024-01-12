package connectors

import (
	"context"
	"fmt"
	"time"

	"github.com/charmbracelet/log"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"

	grpc_generated "github.com/Archisman-Mridha/instagram-clone/backend/gateway/generated/grpc"
	"github.com/Archisman-Mridha/instagram-clone/backend/gateway/utils"
)

type PostsMicroserviceConnector struct {
	grpc_generated.PostsServiceClient

	serviceName,
	address string

	grpcConnection *grpc.ClientConn
}

func NewPostsMicroserviceConnector() *PostsMicroserviceConnector {
	u := &PostsMicroserviceConnector{
		serviceName: "posts microservice",
		address:     utils.Envs.POSTS_MICROSERVICE_URL,
	}

	u.grpcConnection = createGrpcConnection(u.serviceName, u.address)
	u.PostsServiceClient = grpc_generated.NewPostsServiceClient(u.grpcConnection)

	if err := u.Healthcheck(); err != nil {
		log.Fatalf("Couldn't connect to posts microservice : %v", err)
	}

	log.Debugf("Connected to %s", u.serviceName)

	return u
}

func (u *PostsMicroserviceConnector) Healthcheck() error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if _, err := u.Ping(ctx, &emptypb.Empty{}); err != nil {
		return fmt.Errorf("error pinging %s: %v", u.serviceName, err)
	}

	return nil
}

func (u *PostsMicroserviceConnector) Disconnect() {
	if err := u.grpcConnection.Close(); err != nil {
		log.Errorf("Error closing connection to %s : %v", u.serviceName, err)
	}

	log.Debugf("Closed connection to %s", u.serviceName)
}
