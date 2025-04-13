package usecases

import (
	"context"

	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

func (u *Usecases) SearchProfiles(ctx context.Context,
	query string,
	paginationArgs *sharedTypes.PaginationArgs,
) ([]*coreTypes.ProfilePreview, error) {
	return u.searchEngine.SearchProfiles(ctx, query, paginationArgs)
}
