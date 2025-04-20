package main

import (
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"google.golang.org/grpc/codes"
)

// Returns suitable gRPC error status code, based on the given error.
func getGRPCErrorStatusCode(err error) codes.Code {
	if _, ok := err.(sharedUtils.APIError); ok {
		switch err {
		default:
			return codes.Unknown
		}
	}

	return codes.Internal
}
