package main

import (
	inbound_adapters "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/adapters/inbound"
	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/usecases"
)

func main( ) {

	usecasesLayer := &usecases.Usecases{ }

	grpcServer := &inbound_adapters.GrpcServer{ }
	grpcServer.Start(usecasesLayer)
	defer grpcServer.Stop( )

}