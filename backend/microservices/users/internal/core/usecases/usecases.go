package usecases

import (
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/core/types/repositories"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type Usecases struct {
	Cache           sharedTypes.KVStore
	UsersRepository repositories.UsersRepository
}
