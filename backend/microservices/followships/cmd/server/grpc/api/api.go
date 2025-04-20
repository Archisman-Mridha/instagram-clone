package api

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/followships/cmd/server/grpc/api/proto/generated"
	followshipsService "github.com/Archisman-Mridha/instagram-clone/backend/microservices/followships/internal/services/followships"
	"google.golang.org/protobuf/types/known/emptypb"
)

type GRPCAPI struct {
	generated.UnimplementedFollowshipsServiceServer

	followshipsService *followshipsService.FollowshipsService
}

func NewGRPCAPI(followshipsService *followshipsService.FollowshipsService) *GRPCAPI {
	return &GRPCAPI{
		followshipsService: followshipsService,
	}
}

func (*GRPCAPI) Ping(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, nil
}
