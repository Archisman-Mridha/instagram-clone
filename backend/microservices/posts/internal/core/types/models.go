package types

import (
	"time"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type Post struct {
	ID,
	OwnerID sharedTypes.ID

	Description string

	CreatedAt time.Time
}
