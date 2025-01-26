package api

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/proto/pkg/generated"
	"google.golang.org/protobuf/types/known/emptypb"
)

type GRPCAPI struct {
	generated.UnimplementedUsersServiceV1Server
}

func (*GRPCAPI) Ping(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, nil
}
