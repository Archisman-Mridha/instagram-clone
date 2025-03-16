package usecases

import (
	"context"

	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

func (u *Usecases) GetProfilePreviews(ctx context.Context,
	ids []sharedTypes.ID,
) ([]*coreTypes.ProfilePreview, error) {
	return u.profilesRepository.GetPreviews(ctx, ids)
}
