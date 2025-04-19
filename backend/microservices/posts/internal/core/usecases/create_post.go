package usecases

import (
	"context"

	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/core/types"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type (
	CreatePostArgs struct {
		OwnerID     sharedTypes.ID
		Description string `validate:"description"`
	}
)

func (u *Usecases) CreatePost(ctx context.Context, args *coreTypes.CreatePostArgs) (sharedTypes.ID, error) {
	// Validate input.
	err := u.validator.StructCtx(ctx, args)
	if err != nil {
		return 0, err
	}

	return u.postsRepository.Create(ctx, args)
}
