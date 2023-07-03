package main

import (
	shared_utils "github.com/Archisman-Mridha/instagram-clone/backend/shared/utils"

	inbound_adapters "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/adapters/inbound"
	outbound_adapters "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/adapters/outbound"
	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/usecases"
)

func main() {

	primaryDB := &outbound_adapters.AuthenticationDB{}
	primaryDB.Connect()
	defer primaryDB.Disconnect()

	rabbitMQConnection := shared_utils.CreateRabbitMQConnection()
	defer rabbitMQConnection.Close()

	messageSender := &outbound_adapters.MessageSender{}
	messageSender.Setup(rabbitMQConnection)
	defer messageSender.Cleanup()

	usecasesLayer := &usecases.Usecases{

		PrimaryDB:     primaryDB,
		MessageSender: messageSender,
	}

	appServer := &inbound_adapters.GrpcServer{}
	appServer.Start(usecasesLayer)

}
