package usecases

import (
	"context"

	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/core/types"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

func (u *Usecases) GetPosts(ctx context.Context, ids []sharedTypes.ID) ([]*coreTypes.Post, error) {
	return u.postsRepository.GetPosts(ctx, ids)
}
