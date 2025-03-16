package types

import "context"

type SearchEngine interface {
	IndexProfile(ctx context.Context, profilePreview *ProfilePreview) error
	SearchProfiles(ctx context.Context, query string) ([]*ProfilePreview, error)
}
