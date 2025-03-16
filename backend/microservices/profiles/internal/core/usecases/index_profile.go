package usecases

import (
	"context"

	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
)

func (u *Usecases) IndexProfile(ctx context.Context, profilePreview *coreTypes.ProfilePreview) error {
	return u.searchEngine.IndexProfile(ctx, profilePreview)
}
