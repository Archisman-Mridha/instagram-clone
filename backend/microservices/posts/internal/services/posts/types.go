package posts

import (
	"context"
	"time"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type Post struct {
	ID,
	OwnerID sharedTypes.ID

	Description string

	CreatedAt time.Time
}

type PostsRepository interface {
	Create(ctx context.Context, args *CreatePostArgs) (sharedTypes.ID, error)

	GetPosts(ctx context.Context, ids []sharedTypes.ID) ([]*Post, error)
	GetPostsOfUser(ctx context.Context, args *GetPostsOfUserArgs) ([]*Post, error)
}
