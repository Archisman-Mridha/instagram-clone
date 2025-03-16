package constants

import (
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
)

var ErrDuplicateID = sharedUtils.NewAPIError("profile with given id already exists")
