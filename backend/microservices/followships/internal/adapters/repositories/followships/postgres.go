package posts

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/followships/internal/adapters/repositories/followships/generated"
	followshipsService "github.com/Archisman-Mridha/instagram-clone/backend/microservices/followships/internal/services/followships"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/connectors"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
)

type FollowshipsRepositoryAdapter struct {
	*connectors.PostgresConnector
	queries *generated.Queries
}

func NewFollowshipsRepositoryAdapter(ctx context.Context,
	args *connectors.NewPostgresConnectorArgs,
) *FollowshipsRepositoryAdapter {
	postgresConnector := connectors.NewPostgresConnector(ctx, args)

	queries := generated.New(postgresConnector.GetConnection())

	return &FollowshipsRepositoryAdapter{
		postgresConnector,
		queries,
	}
}

func (f *FollowshipsRepositoryAdapter) CreateFollowship(ctx context.Context,
	args *followshipsService.FollowshipOperationArgs,
) error {
	err := f.queries.CreateFollowship(ctx, (*generated.CreateFollowshipParams)(args))
	if err != nil {
		return sharedUtils.WrapError(err)
	}
	return nil
}

func (f *FollowshipsRepositoryAdapter) DeleteFollowship(ctx context.Context,
	args *followshipsService.FollowshipOperationArgs,
) error {
	err := f.queries.DeleteFollowship(ctx, (*generated.DeleteFollowshipParams)(args))
	if err != nil {
		return sharedUtils.WrapError(err)
	}
	return nil
}

func (f *FollowshipsRepositoryAdapter) FollowshipExists(ctx context.Context,
	args *followshipsService.FollowshipOperationArgs,
) (bool, error) {
	err := f.queries.GetFollowship(ctx, (*generated.GetFollowshipParams)(args))
	if err != nil {
		pgErr, ok := err.(*pgconn.PgError)
		if ok && (pgErr.Code == pgerrcode.NoDataFound) {
			return false, nil
		}

		return false, sharedUtils.WrapError(err)
	}
	return true, nil
}

func (f *FollowshipsRepositoryAdapter) GetFollowers(ctx context.Context,
	args *followshipsService.GetFollowersArgs,
) ([]sharedTypes.ID, error) {
	followers, err := f.queries.GetFollowers(ctx, &generated.GetFollowersParams{
		FolloweeID: args.FolloweeID,

		Offset: int32(args.PaginationArgs.Offset),
		Limit:  int32(args.PaginationArgs.PageSize),
	})
	if err != nil {
		return nil, sharedUtils.WrapError(err)
	}
	return followers, nil
}

func (f *FollowshipsRepositoryAdapter) GetFollowings(ctx context.Context,
	args *followshipsService.GetFollowingsArgs,
) ([]sharedTypes.ID, error) {
	followings, err := f.queries.GetFollowings(ctx, &generated.GetFollowingsParams{
		FollowerID: args.FollowerID,

		Offset: int32(args.PaginationArgs.Offset),
		Limit:  int32(args.PaginationArgs.PageSize),
	})
	if err != nil {
		return nil, sharedUtils.WrapError(err)
	}
	return followings, nil
}

func (f *FollowshipsRepositoryAdapter) GetFollowerAndFollowingCounts(ctx context.Context,
	userID sharedTypes.ID,
) (*followshipsService.GetFollowerAndFollowingCountsOutput, error) {
	followerAndFollowingCounts, err := f.queries.GetFollowerAndFollowingCounts(ctx, userID)
	if err != nil {
		return nil, sharedUtils.WrapError(err)
	}
	return (*followshipsService.GetFollowerAndFollowingCountsOutput)(followerAndFollowingCounts), nil
}
