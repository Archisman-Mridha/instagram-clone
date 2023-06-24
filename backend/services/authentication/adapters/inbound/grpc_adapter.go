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
	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/utils"
)

const GRPC_PORT= 4000

type GrpcAdapter struct {
	tcpListener net.Listener
	server *grpc.Server
}

func(g *GrpcAdapter) Start(usecasesLayer *usecases.Usecases) {

	var err error

	if g.tcpListener, err= net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", GRPC_PORT)); err != nil {
		log.Panicf("💀 Error binding to port %d: %v", GRPC_PORT, err)
	}

	g.server= grpc.NewServer(grpc.EmptyServerOption{ })

	protoc_generated.RegisterAuthenticationServer(g.server, &AuthenticationGrpcServiceImplementation{ usecasesLayer: usecasesLayer })
	reflection.Register(g.server)

	log.Println("🔥 Starting gRPC server")
	g.server.Serve(g.tcpListener)

}

func(g *GrpcAdapter) Stop( ) {

	g.tcpListener.Close( )
	g.server.GracefulStop( )
}

type AuthenticationGrpcServiceImplementation struct {
	protoc_generated.UnimplementedAuthenticationServer

	usecasesLayer *usecases.Usecases
}

func(a *AuthenticationGrpcServiceImplementation) StartRegistration(
	ctx context.Context, request *protoc_generated.StartRegistrationRequest,
) (response *protoc_generated.StartRegistrationResponse, err error) {

	_, err= a.usecasesLayer.StartRegistration(
		&usecases.StartRegistrationParameters{
			Name: request.GetName( ),
			Email: request.GetEmail( ),
		},
	)
	if err != nil {
		err= status.Error(400, utils.ServerErrorOccurredErrMsg)
	}

	return

}