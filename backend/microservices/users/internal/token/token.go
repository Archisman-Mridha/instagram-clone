package token

import (
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
)

type (
	Token = string

	TokenService interface {
		Issue(userID sharedTypes.ID) (*Token, error)
		GetUserIDFromToken(token Token) (*sharedTypes.ID, error)
	}
)
