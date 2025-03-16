package usecases

import (
	"context"

	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
)

func (u *Usecases) CreateProfile(ctx context.Context, args *coreTypes.CreateProfileArgs) error {
	return u.profilesRepository.Create(ctx, args)
}
