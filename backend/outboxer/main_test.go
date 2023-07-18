package main

import (
	"context"
	"os/exec"
	"sync"
	"testing"
	"time"

	protoc_generated "github.com/Archisman-Mridha/instagram-clone/backend/proto/generated"
	shared_utils "github.com/Archisman-Mridha/instagram-clone/backend/shared/utils"
	_ "github.com/lib/pq"
	"google.golang.org/protobuf/proto"

	sqlc_generated "github.com/Archisman-Mridha/outboxer/adapters/dbs/sql/generated"
)

func TestMessageDispatcher(t *testing.T) {

	// Execute 'docker-compose up -d --build' command to start Postgres, RabbitMQ and outboxer
	// containers.
	command := exec.Command("docker-compose", "up", "-d", "--build")
	if err := command.Run(); err != nil {
		t.Errorf("Error starting docker-compose project: %v", err)
	}
	// Wait some time for the containers to be ready.
	time.Sleep(5 * time.Second)

	const (
		BATCH_SIZE = 5
		DB_URI     = "postgresql://default:password@localhost:5432/authentication?sslmode=disable"

		MQ_URI        = "amqp://default:password@localhost:5672"
		MQ_QUEUE_NAME = "events-for-authentication-microservice"

		REGISTRATION_EMAIL = "archi.procoder@gmail.com"
	)

	// Establish connection with the outbox DB and MQ.
	var (
		dbConnection = shared_utils.ConnectPostgres(DB_URI)
		querier      = sqlc_generated.New(dbConnection)

		mqConnection = shared_utils.ConnectRabbitMQ(MQ_URI)
		mqChannel    = shared_utils.CreateChannelAndDeclareQueue(mqConnection, MQ_QUEUE_NAME)
	)

	// Ensuring cleanup
	defer func() {
		command = exec.Command("docker-compose", "down")
		if err := command.Run(); err != nil {
			t.Errorf("Error stopping docker-compose project: %v", err)
		}

		dbConnection.Close()

		mqChannel.Close()
		mqConnection.Close()
	}()

	t.Run("🧪 outboxer should propagate the message from DB to mq successfully", func(t *testing.T) {
		// Insert a message into the outbox DB table.
		message, err := proto.Marshal(
			&protoc_generated.UserRegistrationStartedEvent{
				Email: REGISTRATION_EMAIL,
			},
		)
		if err != nil {
			t.Errorf("Error proto marshalling: %v", err)
		}
		if err := querier.InsertMessage(context.Background(), message); err != nil {
			t.Errorf("Error inserting message into database: %v", err)
		}

		// The message should reach from outbox DB to the MQ within 30 seconds. If it doesn't then,
		// after 30 seconds, a value will be pushed into the timeoutChan. This will cause this testcase
		// to fail and exit.
		timeoutChan := make(chan bool)
		waitGroup := &sync.WaitGroup{}
		waitGroup.Add(1)
		go func() {
			defer waitGroup.Done()

			time.Sleep(30 * time.Second)
			timeoutChan <- true
		}()

		// Wait for the outboxer container to forward the message to the MQ. After the message
		// gets published, we will consume that message.
		messages, err := mqChannel.Consume(MQ_QUEUE_NAME, "", false, false, false, false, nil)
		if err != nil {
			t.Errorf("Error trying to consume messages from RabbitMQ: %v", err)
		}
		select {
		case <-messages:
			t.Log("Message received in MQ. Test successfull!")

		// If the message doesn't reach the MQ within 30 seconds, then fail the testcase and exit.
		case <-timeoutChan:
			t.Error("Message didn't reach the MQ (timed out)")
		}

	})

}
