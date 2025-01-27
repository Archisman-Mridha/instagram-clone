package usecases

import (
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/posts/internal/core/types"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type Usecases struct {
	Cache           sharedTypes.KVStore
	PostsRepository types.PostsRepository
}
