package followships

import (
	"context"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type Followship struct {
	ID,

	FollowerID,
	FolloweeID sharedTypes.ID
}

type FollowshipsRepository interface {
	CreateFollowship(ctx context.Context, args *FollowshipOperationArgs) error
	DeleteFollowship(ctx context.Context, args *FollowshipOperationArgs) error
	FollowshipExists(ctx context.Context, args *FollowshipOperationArgs) (bool, error)

	GetFollowers(ctx context.Context, args *GetFollowersArgs) ([]sharedTypes.ID, error)
	GetFollowings(ctx context.Context, args *GetFollowingsArgs) ([]sharedTypes.ID, error)
	GetFollowerAndFollowingCounts(ctx context.Context, userID sharedTypes.ID) (*GetFollowerAndFollowingCountsOutput, error)
}
