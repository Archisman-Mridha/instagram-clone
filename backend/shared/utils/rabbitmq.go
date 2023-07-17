package shared_utils

import (
	"log"

	"github.com/streadway/amqp"
)

// ConnectRabbitMQ creates a connection to the RabbitMQ cluster present at the given uri.
// It returns the connection, if successfully created.
func ConnectRabbitMQ(uri string) *amqp.Connection {
	connection, err := amqp.Dial(uri)
	if err != nil {
		log.Fatalf("Error connecting to RabbitMQ: %v", err)
	}
	defer connection.Close()

	log.Printf("Connected to RabbitMQ")
	return connection
}

// CreateChannelAndDeclareQueue creates a RabbitMQ channel and then declares the necessary RabbitMQ
// queue. It returns the RabbitMQ channel, if successfully created.
func CreateChannelAndDeclareQueue(connection *amqp.Connection, queueName string) *amqp.Channel {
	channel, err := connection.Channel()
	if err != nil {
		log.Fatalf("Error creating RabbitMQ channel: %v", err)
	}
	if _, err := channel.QueueDeclare(queueName, false, false, false, false, nil); err != nil {
		log.Fatalf("Error declaring queue %s in RabbitMQ: %v", queueName, err)
	}

	return channel
}
