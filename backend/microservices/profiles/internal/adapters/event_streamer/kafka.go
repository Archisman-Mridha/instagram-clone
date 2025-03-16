package event_streamer

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/usecases"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/connectors"
)

type EventStreamerAdapter struct {
	*connectors.KafkaConnector

	usecases *usecases.Usecases
}

func NewEventStreamerAdapter(ctx context.Context,
	args *connectors.NewKafkaConnectorArgs,
	usecases *usecases.Usecases,
) *EventStreamerAdapter {
	kafkaConnector := connectors.NewKafkaConnector(ctx, args)

	return &EventStreamerAdapter{
		kafkaConnector,
		usecases,
	}
}

func (e *EventStreamerAdapter) Consume() {}
