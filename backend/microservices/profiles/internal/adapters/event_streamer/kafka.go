package event_streamer

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/config"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/constants"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/usecases"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/version"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/connectors"
	profilesMicroservice "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/events/proto/generated/profiles"
	usersMicroservice "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/events/proto/generated/users"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logs/logger"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/twmb/franz-go/pkg/kgo"
)

type EventStreamerAdapter struct {
	*connectors.KafkaConnector

	usecases *usecases.Usecases
}

func NewEventStreamerAdapter(ctx context.Context,
	kafkaConfig *config.KafkaConfig,
	usecases *usecases.Usecases,
) *EventStreamerAdapter {
	group := fmt.Sprintf("%s-%s", constants.SERVICE_NAME, version.Version)

	kafkaConnector := connectors.NewKafkaConnector(ctx, &connectors.NewKafkaConnectorArgs{
		SeedBrokerURLs: kafkaConfig.SeedBrokerURLs,
		Group:          group,
		Topics: []string{
			sharedUtils.KafkaTopicUsersCreated,

			sharedUtils.KafkaTopicProfilesCreated,
		},
	})

	return &EventStreamerAdapter{
		kafkaConnector,
		usecases,
	}
}

func (e *EventStreamerAdapter) Consume(ctx context.Context) {
	kafkaClient := e.KafkaConnector.GetClient()

	for {
		records := kafkaClient.PollRecords(ctx, constants.MAX_RECORDS_PER_EVENT_STREAMER_POLL)

		records.EachRecord(func(record *kgo.Record) {
			go func() {
				var dbEvent sharedTypes.DBEvent
				err := json.Unmarshal(record.Value, &dbEvent)
				if err != nil {
					slog.ErrorContext(ctx, "Failed JSON unmarshalling Kafka record as DBEvent", logger.Error(err))
					return
				}

				switch record.Topic {
				case sharedUtils.KafkaTopicUsersCreated:
					e.HandleUserCreatedEvent(ctx, &dbEvent)

				case sharedUtils.KafkaTopicProfilesCreated:
					e.HandleProfileCreatedEvent(ctx, &dbEvent)

				default:
					slog.WarnContext(ctx, "Received record from unknown topic", slog.String("topic", record.Topic))
				}

				kafkaClient.MarkCommitRecords(record)
			}()
		})
	}
}

func (e *EventStreamerAdapter) HandleUserCreatedEvent(ctx context.Context, dbEvent *sharedTypes.DBEvent) {
	var userCreatedEvent usersMicroservice.UserCreatedEvent
	err := userCreatedEvent.UnmarshalVT(dbEvent.Payload.After)
	if err != nil {
		slog.ErrorContext(ctx, "Failed unmarshalling event", slog.String("type", "user-created"), logger.Error(err))
		return
	}

	err = e.usecases.CreateProfile(ctx, &types.CreateProfileArgs{})
	if err != nil {
		slog.ErrorContext(ctx, "Failed creating profile", logger.Error(err))
		return
	}
}

func (e *EventStreamerAdapter) HandleProfileCreatedEvent(ctx context.Context, dbEvent *sharedTypes.DBEvent) {
	var profileCreatedEvent profilesMicroservice.ProfileCreatedEvent
	err := profileCreatedEvent.UnmarshalVT(dbEvent.Payload.After)
	if err != nil {
		slog.ErrorContext(ctx, "Failed unmarshalling event", slog.String("type", "profile-created"), logger.Error(err))
		return
	}

	err = e.usecases.IndexProfile(ctx, &types.ProfilePreview{})
	if err != nil {
		slog.ErrorContext(ctx, "Failed indexing profile", logger.Error(err))
		return
	}
}
