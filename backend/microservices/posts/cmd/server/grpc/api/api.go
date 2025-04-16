package api

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/cmd/server/grpc/api/proto/generated"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/core/usecases"
	"google.golang.org/protobuf/types/known/emptypb"
)

type GRPCAPI struct {
	generated.UnimplementedPostsServiceServer

	usecases *usecases.Usecases
}

func NewGRPCAPI(usecases *usecases.Usecases) *GRPCAPI {
	return &GRPCAPI{usecases: usecases}
}

func (*GRPCAPI) Ping(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, nil
}
