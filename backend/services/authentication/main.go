package main

import (
	inbound_adapters "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/adapters/inbound"
	outbound_adapters "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/adapters/outbound"
	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/usecases"
)

func main( ) {

  primaryDB := &outbound_adapters.AuthenticationDB{ }
  primaryDB.Connect( )
  defer primaryDB.Disconnect( )

  messageSender := &outbound_adapters.MessageSender{ }
  messageSender.Connect( )
  defer messageSender.Disconnect( )

	usecasesLayer := &usecases.Usecases{

    PrimaryDB: primaryDB,
    MessageSender: messageSender,

  }

	appServer := &inbound_adapters.GrpcServer{ }
	appServer.Start(usecasesLayer)
	defer appServer.Stop( )

}