package utils

import (
	"fmt"

	"github.com/caarlos0/env/v9"
	"github.com/joho/godotenv"
)

type EnvsSchema struct {
	GRAPHQL_SERVER_PORT string `env:"GRAPHQL_SERVER_PORT,notEmpty"`

	USERS_MICROSERVICE_URL       string `env:"USERS_MICROSERVICE_URL,notEmpty"`
	PROFILES_MICROSERVICE_URL    string `env:"PROFILES_MICROSERVICE_URL,notEmpty"`
	FOLLOWSHIPS_MICROSERVICE_URL string `env:"FOLLOWSHIPS_MICROSERVICE_URL,notEmpty"`
	POSTS_MICROSERVICE_URL       string `env:"POSTS_MICROSERVICE_URL,notEmpty"`
	FEEDS_MICROSERVICE_URL       string `env:"FEEDS_MICROSERVICE_URL,notEmpty"`

	JAEGER_COLLECTOR_URL string `env:"JAEGER_COLLECTOR_URL,notEmpty"`
}

var Envs EnvsSchema

func LoadEnvs() {
	godotenv.Load(".env")

	if err := env.Parse(&Envs); err != nil {
		panic(fmt.Sprintf("Retrieving envs: %v", err))
	}
}
