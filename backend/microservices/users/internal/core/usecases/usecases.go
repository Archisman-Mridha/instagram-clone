package usecases

import (
	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/core/types"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/core/validators"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/token"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	goValidator "github.com/go-playground/validator/v10"
)

type Usecases struct {
	validator *goValidator.Validate

	cache           sharedTypes.KVStore
	usersRepository coreTypes.UsersRepository

	tokenService token.TokenService
}

func NewUsecases(
	validator *goValidator.Validate,
	cache sharedTypes.KVStore,
	usersRespository coreTypes.UsersRepository,
	tokenService token.TokenService,
) *Usecases {
	sharedUtils.RegisterCustomFieldValidators(validator, map[string]goValidator.Func{
		"name":     validators.NameFieldValidator,
		"email":    validators.EmailFieldValidator,
		"username": validators.UsernameFieldValidator,
		"password": validators.PasswordFieldValidator,
	})

	return &Usecases{
		validator,
		cache,
		usersRespository,
		tokenService,
	}
}
