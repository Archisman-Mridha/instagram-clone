package posts

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/adapters/repositories/posts/generated"
	postsService "github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/services/posts"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/connectors"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
)

type PostsRepositoryAdapter struct {
	*connectors.PostgresConnector
	queries *generated.Queries
}

func NewPostsRepositoryAdapter(ctx context.Context,
	args *connectors.NewPostgresConnectorArgs,
) *PostsRepositoryAdapter {
	postgresConnector := connectors.NewPostgresConnector(ctx, args)

	queries := generated.New(postgresConnector.GetConnection())

	return &PostsRepositoryAdapter{
		postgresConnector,
		queries,
	}
}

func (p *PostsRepositoryAdapter) Create(ctx context.Context,
	args *postsService.CreatePostArgs,
) (sharedTypes.ID, error) {
	postID, err := p.queries.CreatePost(ctx, (*generated.CreatePostParams)(args))
	if err != nil {
		return 0, sharedUtils.WrapError(err)
	}
	return postID, nil
}

func (p *PostsRepositoryAdapter) GetPosts(ctx context.Context,
	ids []sharedTypes.ID,
) ([]*postsService.Post, error) {
	posts := []*postsService.Post{}

	rows, err := p.queries.GetPosts(ctx, ids)
	if err != nil {
		return posts, sharedUtils.WrapError(err)
	}

	for _, row := range rows {
		posts = append(posts, (*postsService.Post)(row))
	}
	return posts, nil
}

func (p *PostsRepositoryAdapter) GetPostsOfUser(ctx context.Context,
	args *postsService.GetPostsOfUserArgs,
) ([]*postsService.Post, error) {
	posts := []*postsService.Post{}

	rows, err := p.queries.GetPostsOfUser(ctx, &generated.GetPostsOfUserParams{
		OwnerID: args.OwnerID,

		Offset: int32(args.PaginationArgs.Offset),
		Limit:  int32(args.PaginationArgs.PageSize),
	})
	if err != nil {
		return posts, sharedUtils.WrapError(err)
	}

	for _, row := range rows {
		posts = append(posts, (*postsService.Post)(row))
	}
	return posts, nil
}
