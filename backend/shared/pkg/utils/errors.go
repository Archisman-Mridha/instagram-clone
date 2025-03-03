package utils

import (
	"errors"

	goErrors "github.com/go-errors/errors"
)

/*
When the presentation layer (in this case, gRPC server) gets :

	(1) an error of type APIError, it straight away sends that to the client.
	    The gRPC error status code can be decided based on the concrete error type (like
	    ErrUserNotFound).

	(2) any other type of (unexpected) error, it logs that error and sends the ErrInternalServer back
	    to the client.
	    The gRPC error status code will always be codes.Internal.
*/
type APIError error

// Returns an APIError, constructed using the given error message.
func NewAPIError(message string) APIError {
	return errors.New(message).(APIError)
}

var ErrInternalServer = errors.New("internal server error")

// Returns a new error which contains the stacktrace along with the original error message.
func WrapError(err error) error {
	return goErrors.Wrap(err, 0)
}

/*
Returns a new error which contains :

	(1) the stacktrace

	(2) some contextual error message along with the original error message.
*/
func WrapErrorWithPrefix(contextualErrorMessage string, err error) error {
	return goErrors.WrapPrefix(err, contextualErrorMessage, 0)
}
