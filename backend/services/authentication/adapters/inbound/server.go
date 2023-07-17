package inbound_adapters

import (
	"context"
	"fmt"
	"log"
	"net"

	protoc_generated "github.com/Archisman-Mridha/instagram-clone/backend/proto/generated"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"google.golang.org/grpc/status"

	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/usecases"
	error_messages "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/utils/error-messages"
)

type GrpcServer struct {
	tcpListener net.Listener
	server      *grpc.Server
}

func (g *GrpcServer) Start(port string, usecasesLayer *usecases.Usecases) {
	var err error

	if g.tcpListener, err = net.Listen("tcp", fmt.Sprintf("0.0.0.0:%s", port)); err != nil {
		log.Panicf("Error binding to port %s: %v", port, err)
	}

	g.server = grpc.NewServer(grpc.EmptyServerOption{})

	protoc_generated.RegisterAuthenticationServer(g.server, &AuthenticationGrpcServiceImplementation{usecasesLayer: usecasesLayer})
	reflection.Register(g.server)

	log.Printf("Starting gRPC server at port %s", port)
	g.server.Serve(g.tcpListener)
}

func (g *GrpcServer) Stop() {
	if err := g.tcpListener.Close(); err != nil {
		log.Printf("Error closing underlying tcp connection of the gRPC server: %v", err)
	}
	g.server.GracefulStop()
}

type AuthenticationGrpcServiceImplementation struct {
	protoc_generated.UnimplementedAuthenticationServer

	usecasesLayer *usecases.Usecases
}

func (a *AuthenticationGrpcServiceImplementation) StartRegistration(
	ctx context.Context, request *protoc_generated.StartRegistrationRequest,
) (response *protoc_generated.StartRegistrationResponse, err error) {

	_, err = a.usecasesLayer.StartRegistration(
		&usecases.StartRegistrationParameters{Email: request.GetEmail()},
	)
	if err != nil {
		err = status.Error(400, error_messages.ServerErrorOccurred)
	}

	return
}
