package types

import (
	"context"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type (
	PostsRepository interface {
		Create(ctx context.Context, args *CreatePostArgs) (sharedTypes.ID, error)

		GetPosts(ctx context.Context, ids []sharedTypes.ID) ([]*Post, error)
		GetUserPosts(ctx context.Context, args *GetUserPostsArgs) ([]*Post, error)
	}

	CreatePostArgs struct {
		OwnerID     sharedTypes.ID
		Description string `validate:"description"`
	}

	GetUserPostsArgs struct {
		OwnerID        sharedTypes.ID
		PaginationArgs *sharedTypes.PaginationArgs
	}
)
