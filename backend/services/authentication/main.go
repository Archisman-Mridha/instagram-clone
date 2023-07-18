package main

import (
	shared_utils "github.com/Archisman-Mridha/instagram-clone/backend/shared/utils"
	"github.com/caarlos0/env/v9"
	"github.com/charmbracelet/log"

	inbound_adapters "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/adapters/inbound"
	outbound_adapters "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/adapters/outbound"
	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/usecases"
	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/utils"
)

type Envs struct {
	GRPC_PORT    string `env:"GRPC_PORT,notEmpty"`
	POSTGRES_URL string `env:"POSTGRES_URL,notEmpty"`
}

var envs Envs

func main() {
	utils.Logger = shared_utils.CreateLogger("authentication-microservice")

	if err := env.Parse(&envs); err != nil {
		log.Fatalf("Error retrieving envs: %v", err)
	}

	primaryDB := outbound_adapters.NewAuthenticationDB(envs.POSTGRES_URL)
	defer primaryDB.Disconnect()

	usecasesLayer := &usecases.Usecases{
		PrimaryDB: primaryDB,
	}

	appServer := &inbound_adapters.GrpcServer{}
	appServer.Start(envs.GRPC_PORT, usecasesLayer)

}
