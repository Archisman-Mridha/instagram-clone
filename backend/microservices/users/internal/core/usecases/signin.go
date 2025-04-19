package usecases

import (
	"context"

	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/core/types"
)

type (
	SigninArgs struct {
		Email    *string `validate:"omitempty,email"`
		Username *string `validate:"omitempty,username"`

		Password string `validate:"password"`
	}

	SigninOutput struct {
		JWT string
	}
)

func (u *Usecases) Signin(ctx context.Context, args *SigninArgs) (*SigninOutput, error) {
	// Validate input.
	err := u.validator.StructCtx(ctx, args)
	if err != nil {
		return nil, err
	}

	var userDetails *coreTypes.FindUserByOperationOutput
	switch {
	case args.Email != nil:
		userDetails, err = u.usersRepository.FindByEmail(ctx, *args.Email)

	case args.Username != nil:
		userDetails, err = u.usersRepository.FindByUsername(ctx, *args.Username)

	default:
		panic("unreachable")
	}
	if err != nil {
		return nil, err
	}

	jwt, err := u.tokenService.Issue(userDetails.ID)
	if err != nil {
		return nil, err
	}

	return &SigninOutput{JWT: *jwt}, nil
}
