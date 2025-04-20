package followships

import (
	"context"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type FollowshipsService struct {
	followshipsRepository FollowshipsRepository
}

func NewFollowshipsService(followshipsRespository FollowshipsRepository) *FollowshipsService {
	return &FollowshipsService{
		followshipsRespository,
	}
}

type FollowshipOperationArgs struct {
	FollowerID,
	FolloweeID sharedTypes.ID
}

func (f *FollowshipsService) CreateFollowship(
	ctx context.Context,
	args *FollowshipOperationArgs,
) error {
	return f.followshipsRepository.CreateFollowship(ctx, args)
}

func (f *FollowshipsService) DeleteFollowship(
	ctx context.Context,
	args *FollowshipOperationArgs,
) error {
	return f.followshipsRepository.DeleteFollowship(ctx, args)
}

func (f *FollowshipsService) FollowshipExists(
	ctx context.Context,
	args *FollowshipOperationArgs,
) (bool, error) {
	return f.followshipsRepository.FollowshipExists(ctx, args)
}

type GetFollowersArgs struct {
	FolloweeID sharedTypes.ID

	PaginationArgs *sharedTypes.PaginationArgs
}

func (f *FollowshipsService) GetFollowers(ctx context.Context,
	args *GetFollowersArgs,
) ([]sharedTypes.ID, error) {
	return f.followshipsRepository.GetFollowers(ctx, args)
}

type GetFollowingsArgs struct {
	FollowerID sharedTypes.ID

	PaginationArgs *sharedTypes.PaginationArgs
}

func (f *FollowshipsService) GetFollowings(
	ctx context.Context,
	args *GetFollowingsArgs,
) ([]sharedTypes.ID, error) {
	return f.followshipsRepository.GetFollowings(ctx, args)
}

type GetFollowerAndFollowingCountsOutput struct {
	FollowerCount,
	FollowingCount int64
}

func (f *FollowshipsService) GetFollowerAndFollowingCounts(
	ctx context.Context,
	userID sharedTypes.ID,
) (*GetFollowerAndFollowingCountsOutput, error) {
	return f.followshipsRepository.GetFollowerAndFollowingCounts(ctx, userID)
}
