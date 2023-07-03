package shared_utils

import (
	"log"

	"github.com/streadway/amqp"
)

// CreateRabbitMQConnection creates a connection to the RabbitMQ cluster and returns it.
func CreateRabbitMQConnection() *amqp.Connection {
	uri := GetEnv("RABBITMQ_URL")
	connection, err := amqp.Dial(uri)
	if err != nil {
		log.Fatalf("💀 Error connecting to RabbitMQ: %v", err)
	}
	defer connection.Close()

	log.Printf("🔥 Connected to RabbitMQ")
	return connection
}

// CreateChannelAndDeclareQueue creates a RabbitMQ channel and then declares the necessary RabbitMQ
// queue.
func CreateChannelAndDeclareQueue(connection *amqp.Connection, queueName string) (*amqp.Channel, amqp.Queue, func()) {
	channel, err := connection.Channel()
	if err != nil {
		log.Fatalf("💀 Error creating RabbitMQ channel: %v", err)
	}

	queue, err := channel.QueueDeclare(queueName, false, false, false, false, nil)
	if err != nil {
		log.Fatalf("💀 Error declaring queue %s in RabbitMQ: %v", queueName, err)
	}

	cleanupFn := func() {
		if err := channel.Close(); err != nil {
			log.Printf("💀 Error closing channel in RabbitMQ: %v", err)
		}
	}

	return channel, queue, cleanupFn
}
