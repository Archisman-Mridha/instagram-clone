package repositories

import (
	"context"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type (
	UsersRepository interface {
		Create(ctx context.Context, args *CreateArgs) (*sharedTypes.ID, error)

		FindByEmail(ctx context.Context, email string) (*FindByOperationOutput, error)
		FindByUsername(ctx context.Context, username string) (*FindByOperationOutput, error)
		FindByID(ctx context.Context, id sharedTypes.ID) (*sharedTypes.ID, error)
	}

	CreateArgs struct {
		Name,
		Email,
		Username,
		HashedPassword string
	}

	FindByOperationOutput struct {
		ID             sharedTypes.ID
		HashedPassword string
	}
)
