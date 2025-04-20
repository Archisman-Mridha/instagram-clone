package api

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/cmd/server/grpc/api/proto/generated"
	postsService "github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/services/posts"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	"google.golang.org/protobuf/types/known/emptypb"
)

type GRPCAPI struct {
	generated.UnimplementedPostsServiceServer

	postsService *postsService.PostsService
}

func NewGRPCAPI(postsService *postsService.PostsService) *GRPCAPI {
	return &GRPCAPI{
		postsService: postsService,
	}
}

func (*GRPCAPI) Ping(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, nil
}

func (g *GRPCAPI) CreatePost(ctx context.Context,
	request *generated.CreatePostRequest,
) (*generated.CreatePostResponse, error) {
	postID, err := g.postsService.CreatePost(ctx, &postsService.CreatePostArgs{
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

func (g *GRPCAPI) GetPostsOfUser(ctx context.Context,
	request *generated.GetPostsOfUserRequest,
) (*generated.GetPostsResponse, error) {
	posts, err := g.postsService.GetUserPosts(ctx, &postsService.GetPostsOfUserArgs{
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
	posts, err := g.postsService.GetPosts(ctx, request.PostIds)
	if err != nil {
		return nil, err
	}

	response := &generated.GetPostsResponse{
		Posts: toProtoGeneratedPosts(posts),
	}
	return response, nil
}

// Converts []*postsService.Post to []*generated.Post.
func toProtoGeneratedPosts(input []*postsService.Post) []*generated.Post {
	output := make([]*generated.Post, len(input))
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
