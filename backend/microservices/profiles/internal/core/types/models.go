package types

import (
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
