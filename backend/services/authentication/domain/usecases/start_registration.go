package usecases

import (
	"errors"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
	"github.com/lainio/err2"
	"github.com/lainio/err2/try"

	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/ports"
	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/utils"
)

type (
	StartRegistrationParameters struct {

		Name string `json:"name"`
		Email string `json:"email"`
	}

	StartRegistrationOutput struct { }
)

func(u *Usecases) StartRegistration(parameters *StartRegistrationParameters) (output *StartRegistrationOutput, err error) {
	defer err2.Handle(&err)

	try.To(
		validation.ValidateStruct(parameters,

			validation.Field(&parameters.Name,
				validation.Required, validation.Length(4, 50),
			),
	
			validation.Field(&parameters.Email,
				validation.Required, is.Email,
			),
		),
	)

	isEmailPreRegisteredByVerifiedUser := try.To1[bool](
		u.PrimaryDB.IsEmailPreRegisteredByVerifiedUser(parameters.Email),
	)
	if isEmailPreRegisteredByVerifiedUser {
		err= errors.New(utils.EmailPreRegisteredErrMsg)
		return
	}

	id := try.To1[string](
		u.PrimaryDB.SaveNewUser(
			&ports.UserDetails{
				Name: parameters.Name,
				Email: parameters.Email,
			},
		),
	)

  u.MessageSender.SendUserRegistrationStartedEvent(id)

	return
}