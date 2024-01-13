package utils

import (
	"errors"
	"strings"
)

func ExtractJwtFromAuthorizationHeader(authorizationHeader string) (string, error) {
	parts := strings.Split(authorizationHeader, "Bearer ")
	if len(parts) != 2 || parts[0] != "" {
		return "", errors.New("authorization header is invalid")
	}

	return parts[1], nil
}
