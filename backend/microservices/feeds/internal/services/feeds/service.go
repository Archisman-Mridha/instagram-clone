package feeds

import (
	"context"
	"log/slog"
	"strconv"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
)

type FeedsService struct {
	cache sharedTypes.KVStore
}

func NewFeedsService(cache sharedTypes.KVStore) *FeedsService {
	return &FeedsService{
		cache,
	}
}

type GetFeedArgs struct {
	UserID sharedTypes.ID

	PaginationArgs *sharedTypes.PaginationArgs
}

func (f *FeedsService) GetFeed(ctx context.Context, args *GetFeedArgs) ([]sharedTypes.ID, error) {
	output, err := f.cache.LRange(ctx,
		string(args.UserID),
		int64(args.PaginationArgs.Offset),
		int64(args.PaginationArgs.Offset+args.PaginationArgs.PageSize-1),
	)
	if err != nil {
		return []sharedTypes.ID{}, sharedUtils.WrapError(err)
	}

	postIDs := []sharedTypes.ID{}
	for _, item := range output {
		postID, err := strconv.Atoi(item)
		if err != nil {
			slog.WarnContext(ctx, "Failed parsing post ID", slog.String("value", item))
			continue
		}

		postIDs = append(postIDs, sharedTypes.ID(postID))
	}
	return postIDs, nil
}
