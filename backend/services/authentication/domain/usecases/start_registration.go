package usecases

import (
	"errors"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
	"github.com/lainio/err2"
	"github.com/lainio/err2/try"

	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/ports"
	error_messages "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/utils/error-messages"
)

type StartRegistrationParameters struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func (u *Usecases) StartRegistration(parameters *StartRegistrationParameters) (err error) {
	defer err2.Handle(&err)

	// Validate parameters
	try.To(
		validation.ValidateStruct(parameters,

			validation.Field(&parameters.Email,
				validation.Required, is.Email),

			validation.Field(&parameters.Username,
				validation.Required, is.Alphanumeric, validation.Length(3, 50)),

			validation.Field(&parameters.Password,
				validation.Required, validation.Length(4, 50)),
		),
	)

	// Check that a verified user doesn't exist with the given email.
	isEmailPreRegisteredByVerifiedUser := try.To1[bool](
		u.PrimaryDB.IsEmailPreRegisteredByVerifiedUser(parameters.Email),
	)
	if isEmailPreRegisteredByVerifiedUser {
		err = errors.New(error_messages.EmailPreRegistered)
		return
	}
	// Check that the username is not taken by someone.
	isUsernameTaken := try.To1[bool](
		u.PrimaryDB.IsUsernameTaken(parameters.Username),
	)
	if isUsernameTaken {
		err = errors.New(error_messages.UsernameTaken)
		return
	}

	// Create new user in the database.
	err = u.PrimaryDB.SaveNewUser(
		&ports.UserDetails{Email: parameters.Email},
	)
	if err != nil {
		err = errors.New(error_messages.ServerErrorOccurred)
		return
	}

	return
}
