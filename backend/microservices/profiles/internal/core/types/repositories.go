package types

import (
	"context"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type (
	ProfilesRepository interface {
		// NOTE : Needs to be idempotent, since this is invoked by a DB event processor.
		Create(ctx context.Context, args *CreateProfileArgs) error

		GetPreviews(ctx context.Context, ids []sharedTypes.ID) ([]*ProfilePreview, error)
	}

	CreateProfileArgs struct {
		ID sharedTypes.ID
		Name,
		Username string
	}
)
