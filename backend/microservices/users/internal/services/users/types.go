package users

import (
	"context"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type User struct {
	ID sharedTypes.ID

	Name,
	Email,
	Username,
	HashedPassword string
}

type (
	UsersRepository interface {
		Create(ctx context.Context, args *CreateUserArgs) (sharedTypes.ID, error)

		FindByEmail(ctx context.Context, email string) (*FindUserByOperationOutput, error)
		FindByUsername(ctx context.Context, username string) (*FindUserByOperationOutput, error)
		UserIDExists(ctx context.Context, id sharedTypes.ID) (bool, error)
	}

	CreateUserArgs struct {
		Name,
		Email,
		Username,
		HashedPassword string
	}

	FindUserByOperationOutput struct {
		ID             sharedTypes.ID
		HashedPassword string
	}
)
