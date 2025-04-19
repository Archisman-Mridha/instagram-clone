package api

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/cmd/server/grpc/api/proto/generated"
	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/core/types"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/core/usecases"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
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

func (g *GRPCAPI) CreatePost(ctx context.Context,
	request *generated.CreatePostRequest,
) (*generated.CreatePostResponse, error) {
	postID, err := g.usecases.CreatePost(ctx, &coreTypes.CreatePostArgs{
		OwnerID:     request.OwnerId,
		Description: request.Description,
	})
	if err != nil {
		return nil, err
	}

	response := &generated.CreatePostResponse{
		PostId: postID,
	}
	return response, nil
}

func (g *GRPCAPI) GetUserPosts(ctx context.Context,
	request *generated.GetUserPostsRequest,
) (*generated.GetPostsResponse, error) {
	posts, err := g.usecases.GetUserPosts(ctx, &coreTypes.GetUserPostsArgs{
		OwnerID: request.OwnerId,
		PaginationArgs: &sharedTypes.PaginationArgs{
			Offset:   request.PaginationArgs.Offset,
			PageSize: request.PaginationArgs.PageSize,
		},
	})
	if err != nil {
		return nil, err
	}

	response := &generated.GetPostsResponse{
		Posts: toProtoGeneratedPosts(posts),
	}
	return response, nil
}

func (g *GRPCAPI) GetPosts(ctx context.Context,
	request *generated.GetPostsRequest,
) (*generated.GetPostsResponse, error) {
	posts, err := g.usecases.GetPosts(ctx, request.PostIds)
	if err != nil {
		return nil, err
	}

	response := &generated.GetPostsResponse{
		Posts: toProtoGeneratedPosts(posts),
	}
	return response, nil
}

// Converts []*coreTypes.Post to []*generated.Post.
func toProtoGeneratedPosts(input []*coreTypes.Post) []*generated.Post {
	output := []*generated.Post{}
	for _, item := range input {
		output = append(output, &generated.Post{
			Id:          item.ID,
			OwnerId:     item.OwnerID,
			Description: item.Description,
			CreatedAt:   item.CreatedAt.String(),
		})
	}
	return output
}
