package connectors

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/twmb/franz-go/pkg/kgo"
)

type (
	KafkaConnector struct {
		client *kgo.Client
	}

	NewKafkaConnectorArgs struct {
		SeedBrokerURLs []string `yaml:"seedBrokerURLs" validate:"required,gt=0,dive,notblank"`
	}
)

func NewKafkaConnector(ctx context.Context, args *NewKafkaConnectorArgs) *KafkaConnector {
	client, err := kgo.NewClient(
		kgo.SeedBrokers(args.SeedBrokerURLs...),
	)
	assert.AssertErrNil(ctx, err, "Failed connecting to Kafka")

	// Ping Kafka, verifying that a working connection has been established.
	err = client.Ping(ctx)
	assert.AssertErrNil(ctx, err, "Failed connecting to Kafka")

	return &KafkaConnector{client}
}
