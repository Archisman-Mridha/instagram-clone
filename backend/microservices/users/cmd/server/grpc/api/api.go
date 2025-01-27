package api

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/cmd/server/grpc/api/proto/generated"
	"google.golang.org/protobuf/types/known/emptypb"
)

type GRPCAPI struct {
	generated.UnimplementedUsersServiceServer
}

func (*GRPCAPI) Ping(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, nil
}
