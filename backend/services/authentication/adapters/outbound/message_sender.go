package outbound_adapters

import (
	"log"

	protoc_generated "github.com/Archisman-Mridha/instagram-clone/backend/proto/generated"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/utils"
	rabbitmq_queues "github.com/Archisman-Mridha/instagram-clone/backend/shared/utils/rabbitmq-queues"
	"github.com/streadway/amqp"
	"google.golang.org/protobuf/proto"
)

type MessageSender struct {
  connection *amqp.Connection
  channel *amqp.Channel
  queue amqp.Queue
}

func(m *MessageSender) Connect( ) {

  var err error

  uri := utils.GetEnv("RABBITMQ_URL")
  m.connection, err= amqp.Dial(uri)
  if err != nil {
    log.Fatalf("💀 Error connecting to RabbitMQ: %v", err)
  }
  m.channel, err= m.connection.Channel( )
  if err != nil {
    log.Fatalf("💀 Error creating RabbitMQ channel: %v", err)
  }

  m.queue, err= m.channel.QueueDeclare(
    rabbitmq_queues.AuthenticationMicroservie, false, false, false, false, nil)
  if err != nil {
    log.Fatalf("💀 Error declaring queue %s in RabbitMQ: %v", rabbitmq_queues.AuthenticationMicroservie, err)
  }

  log.Printf("🔥 Connected to RabbitMQ")

}

func(m *MessageSender) SendUserRegistrationStartedEvent(id string) {

  message, err := proto.Marshal(
    &protoc_generated.UserRegistrationStartedEvent{ Id: id },
  )
  if err != nil {
    log.Printf("Proto marshalling error: %v", err)
    return
  }

  m.channel.Publish(
    "",
    m.queue.Name,
    true,
    true,
    amqp.Publishing {
      ContentType: "text/plain",
      Body:        []byte(message),
    },
  )

}

func(m *MessageSender) Disconnect( ) {

  if err := m.channel.Close( ); err != nil {
    log.Printf("💀 Error closing channel in RabbitMQ: %v", err)
  }
  if err := m.connection.Close( ); err != nil {
    log.Printf("💀 Error closing connection to RabbitMQ: %v", err)
  }

}