package usecases

import (
	"context"

	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
)

func (u *Usecases) SearchProfiles(ctx context.Context,
	query string,
) ([]*coreTypes.ProfilePreview, error) {
	return u.searchEngine.SearchProfiles(ctx, query)
}
