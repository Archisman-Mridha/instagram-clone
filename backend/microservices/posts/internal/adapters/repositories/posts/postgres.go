package posts

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/adapters/repositories/posts/generated"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/connectors"
)

type postsRepositoryAdapter struct {
	*connectors.PostgresConnector
	queries *generated.Queries
}

func NewpostsRepositoryAdapter(ctx context.Context,
	args *connectors.NewPostgresConnectorArgs,
) *postsRepositoryAdapter {
	postgresConnector := connectors.NewPostgresConnector(ctx, args)

	queries := generated.New(postgresConnector.GetConnection())

	return &postsRepositoryAdapter{
		postgresConnector,
		queries,
	}
}
