package usecases

type (
	StartRegistrationRequest struct {

		Name string
		Email string
		Username string
		Password string

	}

	StartRegistrationResponse struct { }
)

func(u *Usecases) StartRegistration(parameters *StartRegistrationRequest) (output *StartRegistrationResponse, err error) {

	return

}