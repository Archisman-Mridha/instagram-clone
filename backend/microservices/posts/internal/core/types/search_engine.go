package types

import (
	"context"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type SearchEngine interface {
	// NOTE : Needs to be idempotent, since this is invoked by a DB event processor.
	IndexProfile(ctx context.Context, profilePreview *ProfilePreview) error

	Searchposts(ctx context.Context, query string, paginationArgs *sharedTypes.PaginationArgs) ([]*ProfilePreview, error)
}
