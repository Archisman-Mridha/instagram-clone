package profiles

import (
	"context"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type (
	ProfilePreview struct {
		ID sharedTypes.ID
		Name,
		Username string
	}

	Profile struct {
		ProfilePreview
	}
)

type ProfilesRepository interface {
	// NOTE : Needs to be idempotent, since this is invoked by a DB event processor.
	Create(ctx context.Context, args *CreateProfileArgs) error

	GetPreviews(ctx context.Context, ids []sharedTypes.ID) ([]*ProfilePreview, error)
}

type SearchEngine interface {
	// NOTE : Needs to be idempotent, since this is invoked by a DB event processor.
	IndexProfile(ctx context.Context, profilePreview *ProfilePreview) error

	SearchProfiles(ctx context.Context, args *SearchProfilesArgs) ([]*ProfilePreview, error)
}
