package usecases

import (
	"context"

	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
)

func (u *Usecases) SearchProfiles(ctx context.Context,
	args *coreTypes.SearchProfilesArgs,
) ([]*coreTypes.ProfilePreview, error) {
	// Validate input.
	err := u.validator.StructCtx(ctx, args)
	if err != nil {
		return nil, err
	}

	return u.searchEngine.SearchProfiles(ctx, args)
}
