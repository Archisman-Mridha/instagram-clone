package main

import (
	inbound_adapters "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/adapters/inbound"
	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/usecases"
)

func main( ) {

	usecasesLayer := &usecases.Usecases{ }

	grpcAdapter := &inbound_adapters.GrpcAdapter{ }
	grpcAdapter.Start(usecasesLayer)
	defer grpcAdapter.Stop( )

}