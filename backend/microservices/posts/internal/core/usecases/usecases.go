package usecases

import (
	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/core/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/go-playground/validator/v10"
	goValidator "github.com/go-playground/validator/v10"
)

type Usecases struct {
	validator *validator.Validate

	postsRepository coreTypes.PostsRepository
}

func NewUsecases(
	validator *validator.Validate,
	postsRespository coreTypes.PostsRepository,
) *Usecases {
	sharedUtils.RegisterCustomFieldValidators(validator, map[string]goValidator.Func{})

	return &Usecases{
		validator,
		postsRespository,
	}
}
