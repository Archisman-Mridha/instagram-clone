package main

import (
	"log"

	"github.com/caarlos0/env/v9"
	_ "github.com/lib/pq"

	"github.com/Archisman-Mridha/outboxer/adapters/dbs"
	"github.com/Archisman-Mridha/outboxer/adapters/mqs"
	"github.com/Archisman-Mridha/outboxer/domain/ports"
	"github.com/Archisman-Mridha/outboxer/domain/usecases"
)

type Envs struct {
	DB_TYPE    string `env:"DB_TYPE,notEmpty"`
	DB_URI     string `env:"DB_URI,notEmpty"`
	BATCH_SIZE int    `env:"BATCH_SIZE,notEmpty"`

	MQ_URI        string `env:"MQ_URI,notEmpty"`
	MQ_QUEUE_NAME string `env:"MQ_QUEUE_NAME,notEmpty"`
}

var envs Envs

func main() {
	if err := env.Parse(&envs); err != nil {
		log.Fatalf("Error retrieving envs: %v", err)
	}

	var outboxDB ports.OutboxDB
	switch envs.DB_TYPE {
	case "postgres":
		outboxDB = dbs.NewPostgresAdapter(envs.DB_URI)

	default:
		log.Fatalf("DB type %s not supported", envs.DB_TYPE)
	}
	defer outboxDB.Disconnect()

	var mq ports.MQ = mqs.NewRabbitMQAdapter(envs.MQ_URI, envs.MQ_QUEUE_NAME)
	defer mq.Disconnect()

	usecasesLayer := &usecases.Usecases{}
	usecasesLayer.Run(
		usecases.RunArgs{
			OutboxDB: outboxDB,
			MQ:       mq,

			BatchSize: envs.BATCH_SIZE,
		},
	)
}
