package usecases

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/core/types/repositories"
	"golang.org/x/crypto/bcrypt"
)

type SignupArgs struct {
	Name     string `validate:"name"`
	Email    string `validate:"email"`
	Username string `validate:"username"`
	Password string `validate:"password"`
}

func (u *Usecases) Signup(ctx context.Context, args *SignupArgs) (*SigninOutput, error) {
	err := u.validator.StructCtx(ctx, args)
	if err != nil {
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(args.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	userID, err := u.usersRepository.Create(ctx, &repositories.CreateArgs{
		Name:           args.Name,
		Email:          args.Email,
		Username:       args.Username,
		HashedPassword: string(hashedPassword),
	})
	if err != nil {
		return nil, err
	}

	jwt, err := u.tokenService.Issue(*userID)
	if err != nil {
		return nil, err
	}

	return &SigninOutput{JWT: *jwt}, nil
}
