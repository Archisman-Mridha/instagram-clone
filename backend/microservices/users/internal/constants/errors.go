package constants

import (
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
)

var (
	ErrInvalidEmail    = sharedUtils.NewAPIError("invalid email")
	ErrInvalidUsername = sharedUtils.NewAPIError("invalid username")

	ErrDuplicateEmail    = sharedUtils.NewAPIError("email already exists")
	ErrDuplicateUsername = sharedUtils.NewAPIError("username already exists")

	ErrInvalidJWT = sharedUtils.NewAPIError("invalid JWT")
	ErrExpiredJWT = sharedUtils.NewAPIError("expired JWT")

	ErrUserNotFound = sharedUtils.NewAPIError("user not found")
)
