package main

import (
	"log"

	"github.com/caarlos0/env"

	inbound_adapters "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/adapters/inbound"
	outbound_adapters "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/adapters/outbound"
	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/usecases"
)

type Envs struct {
	GRPC_PORT    string `env:"GRPC_PORT,notEmpty"`
	POSTGRES_URL string `env:"POSTGRES_URL,notEmpty"`
}

var envs Envs

func main() {
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
