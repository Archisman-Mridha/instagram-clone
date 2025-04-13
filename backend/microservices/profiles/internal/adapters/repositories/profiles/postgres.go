package profiles

import (
	"context"
	"log/slog"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/adapters/repositories/profiles/generated"
	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/connectors"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
)

type ProfilesRepositoryAdapter struct {
	*connectors.PostgresConnector
	queries *generated.Queries
}

func NewProfilesRepositoryAdapter(ctx context.Context,
	args *connectors.NewPostgresConnectorArgs,
) *ProfilesRepositoryAdapter {
	postgresConnector := connectors.NewPostgresConnector(ctx, args)

	queries := generated.New(postgresConnector.GetConnection())

	return &ProfilesRepositoryAdapter{
		postgresConnector,
		queries,
	}
}

// NOTE : Needs to be idempotent, since this is invoked by a DB event processor.
func (p *ProfilesRepositoryAdapter) Create(ctx context.Context, args *coreTypes.CreateProfileArgs) error {
	err := p.queries.CreateProfile(ctx, generated.CreateProfileParams{
		ID:       args.ID,
		Name:     args.Name,
		Username: args.Username,
	})
	if err != nil {
		pgErr := err.(*pgconn.PgError)

		// Makes the operation idempotent.
		if (pgErr.Code == pgerrcode.UniqueViolation) && (pgErr.ColumnName == "id") {
			slog.WarnContext(ctx,
				"Can't create profile, since it already exists. Most probably duplicate processed a Kafka record.",
				slog.Int("profile-id", int(args.ID)),
			)
			return nil
		}

		return sharedUtils.WrapError(err)
	}
	return nil
}

func (p *ProfilesRepositoryAdapter) GetPreviews(ctx context.Context,
	ids []sharedTypes.ID,
) ([]*coreTypes.ProfilePreview, error) {
	profilePreviews := []*coreTypes.ProfilePreview{}

	rows, err := p.queries.GetProfilePreviews(ctx, ids)
	if err != nil {
		return profilePreviews, nil
	}

	for _, row := range rows {
		profilePreviews = append(profilePreviews, &coreTypes.ProfilePreview{
			ID:       row.ID,
			Name:     row.Name,
			Username: row.Username,
		})
	}

	return profilePreviews, nil
}
