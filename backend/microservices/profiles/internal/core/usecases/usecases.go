package usecases

import (
	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	goValidator "github.com/go-playground/validator/v10"
)

type Usecases struct {
	validator *goValidator.Validate

	profilesRepository coreTypes.ProfilesRepository
	searchEngine       coreTypes.SearchEngine
}

func NewUsecases(
	validator *goValidator.Validate,
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
