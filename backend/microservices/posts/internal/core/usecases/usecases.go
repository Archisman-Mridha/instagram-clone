package usecases

import (
	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/core/types"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/core/validators"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	goValidator "github.com/go-playground/validator/v10"
)

type Usecases struct {
	validator *goValidator.Validate

	postsRepository coreTypes.PostsRepository
}

func NewUsecases(
	validator *goValidator.Validate,
	postsRespository coreTypes.PostsRepository,
) *Usecases {
	sharedUtils.RegisterCustomFieldValidators(validator, map[string]goValidator.Func{
		"description": validators.DescriptionFieldValidator,
	})

	return &Usecases{
		validator,
		postsRespository,
	}
}
