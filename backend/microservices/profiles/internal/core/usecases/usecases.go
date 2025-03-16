package usecases

import (
	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/go-playground/validator/v10"
	goValidator "github.com/go-playground/validator/v10"
)

type Usecases struct {
	validator *validator.Validate

	profilesRepository coreTypes.ProfilesRepository
	searchEngine       coreTypes.SearchEngine
}

func NewUsecases(
	validator *validator.Validate,
	profilesRespository coreTypes.ProfilesRepository,
	searchEngine coreTypes.SearchEngine,
) *Usecases {
	sharedUtils.RegisterCustomFieldValidators(validator, map[string]goValidator.Func{})

	return &Usecases{
		validator,
		profilesRespository,
		searchEngine,
	}
}
