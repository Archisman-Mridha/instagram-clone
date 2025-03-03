package usecases

import (
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/core/types/repositories"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/token"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/validators"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/go-playground/validator/v10"
	goValidator "github.com/go-playground/validator/v10"
)

type Usecases struct {
	validator *validator.Validate

	cache           sharedTypes.KVStore
	usersRepository repositories.UsersRepository

	tokenService token.TokenService
}

func NewUsecases(
	validator *validator.Validate,
	cache sharedTypes.KVStore,
	usersRespository repositories.UsersRepository,
	tokenService token.TokenService,
) *Usecases {
	sharedUtils.RegisterCustomValidators(validator, map[string]goValidator.Func{
		"name":     validators.NameValidation,
		"username": validators.UsernameValidation,
		"password": validators.PasswordValidation,
	})

	return &Usecases{
		validator,
		cache,
		usersRespository,
		tokenService,
	}
}
