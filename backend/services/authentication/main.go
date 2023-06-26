package main

import (
	"log"

	inbound_adapters "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/adapters/inbound"
	outbound_adapters "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/adapters/outbound"
	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/usecases"
)

func main( ) {

  log.Println("debug")

  primaryDB := &outbound_adapters.Postgresql{ }
  primaryDB.Connect( )
  defer primaryDB.Disconnect( )

	usecasesLayer := &usecases.Usecases{
    PrimaryDB: primaryDB,
  }

	appServer := &inbound_adapters.GrpcServer{ }
	appServer.Start(usecasesLayer)
	defer appServer.Stop( )

}