package usecases

import (
	"context"

	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/core/types"
)

func (u *Usecases) GetUserPosts(ctx context.Context,
	args *coreTypes.GetUserPostsArgs,
) ([]*coreTypes.Post, error) {
	return u.postsRepository.GetUserPosts(ctx, args)
}
