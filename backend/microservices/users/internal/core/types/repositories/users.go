package repositories

import "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"

type (
	UsersRepository interface {
		Create(args CreateArgs) types.ID

		FindByEmail(email string) FindByOperationOutput
		FindByUsername(username string) FindByOperationOutput
		FindByID(id int32) FindByOperationOutput
	}

	CreateArgs struct {
		Name,
		Email,
		Username,
		HashedPassword string
	}

	FindByOperationOutput struct {
		ID             int32
		HashedPassword string
	}
)
