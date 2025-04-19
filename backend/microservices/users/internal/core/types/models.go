package types

import sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"

type User struct {
	ID sharedTypes.ID

	Name,
	Email,
	Username,
	HashedPassword string
}
