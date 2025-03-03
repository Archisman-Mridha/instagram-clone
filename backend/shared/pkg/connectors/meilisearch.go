package connectors

import (
	"context"
	"log/slog"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/meilisearch/meilisearch-go"
)

type (
	MeilisearchConnector struct {
		client *meilisearch.ServiceManager
	}

	NewMeilisearchConnectorArgs struct {
		URL    string `yaml:"url" validate:"required,notblank"`
		APIKey string `yaml:"apiKey" validate:"required,notblank"`
	}
)

func NewMeilisearchConnector(ctx context.Context,
	args *NewMeilisearchConnectorArgs,
) *MeilisearchConnector {
	client, err := meilisearch.Connect(args.URL,
		meilisearch.WithAPIKey(args.APIKey),
		meilisearch.WithContentEncoding(meilisearch.GzipEncoding, meilisearch.BestSpeed),
	)
	assert.AssertErrNil(ctx, err, "Failed connecting to Meilisearch")

	slog.DebugContext(ctx, "Connected to Meilisearch")

	return &MeilisearchConnector{&client}
}
