package mqs

import (
	"log"

	shared_utils "github.com/Archisman-Mridha/instagram-clone/backend/shared/utils"
	"github.com/streadway/amqp"

	"github.com/Archisman-Mridha/outboxer/domain/ports"
)

type RabbitMQAdapter struct {
	connection *amqp.Connection
	channel    *amqp.Channel
	queueName  string
}

func NewRabbitMQAdapter(uri, queueName string) *RabbitMQAdapter {
	r := &RabbitMQAdapter{queueName: queueName}

	r.connection = shared_utils.ConnectRabbitMQ(uri)
	r.channel = shared_utils.CreateChannelAndDeclareQueue(r.connection, queueName)

	return r
}

func (r *RabbitMQAdapter) Disconnect() {
	if err := r.connection.Close(); err != nil {
		log.Printf("Error closing connection to the database: %v", err)
	}
}

func (r *RabbitMQAdapter) PublishMessages(args *ports.PublishMessagesArgs) {
	for item := range args.ToBePublishedItemsChan {
		err := r.channel.Publish("", r.queueName, true, false, amqp.Publishing{Body: item.Message})
		if err != nil {
			log.Printf("Error trying to publish message to rabbitMQ: %v", err)
			args.ItemsFailedTobePublishedChan <- item.RowId
		}
	}
}
