package outbound_adapters

import (
	"log"

	protoc_generated "github.com/Archisman-Mridha/instagram-clone/backend/proto/generated"
	shared_utils "github.com/Archisman-Mridha/instagram-clone/backend/shared/utils"
	"github.com/streadway/amqp"
	"google.golang.org/protobuf/proto"
)

type MessageSender struct {
	channel *amqp.Channel
	queue   amqp.Queue
	Cleanup func()
}

func (m *MessageSender) Setup(connection *amqp.Connection) {
	m.channel, m.queue, m.Cleanup = shared_utils.CreateChannelAndDeclareQueue(connection)
	log.Printf("🔥 Message sender is ready")
}

func (m *MessageSender) SendUserRegistrationStartedEvent(id string) {
	message, err := proto.Marshal(
		&protoc_generated.UserRegistrationStartedEvent{Id: id},
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
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(message),
		},
	)
}
