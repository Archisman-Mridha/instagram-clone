package api

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/feeds/cmd/server/grpc/api/proto/generated"
	feedsService "github.com/Archisman-Mridha/instagram-clone/backend/microservices/feeds/internal/services/feeds"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	"google.golang.org/protobuf/types/known/emptypb"
)

type GRPCAPI struct {
	generated.UnimplementedFeedsServiceServer

	feedsService *feedsService.FeedsService
}

func NewGRPCAPI(feedsService *feedsService.FeedsService) *GRPCAPI {
	return &GRPCAPI{
		feedsService: feedsService,
	}
}

func (*GRPCAPI) Ping(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, nil
}

func (g *GRPCAPI) GetFeed(ctx context.Context,
	request *generated.GetFeedRequest,
) (*generated.GetFeedResponse, error) {
	postIDs, err := g.feedsService.GetFeed(ctx, &feedsService.GetFeedArgs{
		UserID: request.UserId,

		PaginationArgs: &types.PaginationArgs{
			Offset:   uint64(request.Offset),
			PageSize: uint64(request.PageSize),
		},
	})
	if err != nil {
		return nil, err
	}

	response := &generated.GetFeedResponse{
		PostIds: postIDs,
	}
	return response, nil
}
