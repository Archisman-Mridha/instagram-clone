package posts

import (
	"context"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	goValidator "github.com/go-playground/validator/v10"
)

type PostsService struct {
	validator *goValidator.Validate

	postsRepository PostsRepository
}

func NewPostsService(
	validator *goValidator.Validate,
	postsRespository PostsRepository,
) *PostsService {
	sharedUtils.RegisterCustomFieldValidators(validator, map[string]goValidator.Func{
		"description": DescriptionFieldValidator,
	})

	return &PostsService{
		validator,
		postsRespository,
	}
}

type CreatePostArgs struct {
	OwnerID     sharedTypes.ID
	Description string `validate:"description"`
}

func (p *PostsService) CreatePost(ctx context.Context, args *CreatePostArgs) (sharedTypes.ID, error) {
	// Validate input.
	err := p.validator.StructCtx(ctx, args)
	if err != nil {
		return 0, err
	}

	return p.postsRepository.Create(ctx, args)
}

type GetPostsOfUserArgs struct {
	OwnerID        sharedTypes.ID
	PaginationArgs *sharedTypes.PaginationArgs
}

func (p *PostsService) GetUserPosts(ctx context.Context, args *GetPostsOfUserArgs) ([]*Post, error) {
	return p.postsRepository.GetPostsOfUser(ctx, args)
}

func (p *PostsService) GetPosts(ctx context.Context, ids []sharedTypes.ID) ([]*Post, error) {
	return p.postsRepository.GetPosts(ctx, ids)
}
