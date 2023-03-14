package usecases

import (
	entities "AuthenticationMicroservice/Domain/Entities"
	customErrors "AuthenticationMicroservice/Errors"
)

type StartRegistrationParams struct {

	Name string
	Email string
	Username string
	Password string
	DeviceIP string
}

type StartRegistrationOutput struct {
	OTP string

	Errors [ ]string
}

func(instance *Usecases) StartRegistrationUsecase(parameters StartRegistrationParams, generateOTP func( ) string) StartRegistrationOutput {
	var occuringErrors [ ]string

	// Check if the email or username already registered
	existingUsers, error := instance.UsersRepository.FindByEmailOrUsername(parameters.Email, parameters.Username)

		if error != nil {
			occuringErrors = append(occuringErrors, customErrors.ServerError)
			return StartRegistrationOutput{ Errors: occuringErrors }
		}

		for _, existingUser := range existingUsers {

			if existingUser.Email == parameters.Email {
				occuringErrors = append(occuringErrors, customErrors.DuplicateEmailError)}

			if existingUser.Username == parameters.Username {
				occuringErrors = append(occuringErrors, customErrors.DuplicateUsernameError)}
		}

		if len(occuringErrors) > 0 {
			return StartRegistrationOutput{ Errors: occuringErrors }}

	// Check if somebody else is registering with the same email from a different device
	temporaryUserRecord, error := instance.TemporaryUserRecordsRepository.GetByEmail(parameters.Email)

		if error != nil {
			occuringErrors = append(occuringErrors, customErrors.ServerError)
			return StartRegistrationOutput{ Errors: occuringErrors }
		}
	
		if temporaryUserRecord.DeviceIP != parameters.DeviceIP {
	
			occuringErrors = append(occuringErrors, customErrors.SomeoneElseRegisteringWithEmailError)
			return StartRegistrationOutput{ Errors: occuringErrors }
		}

	// Check if somebody else is registering with the same username
	temporaryUserRecord, error = instance.TemporaryUserRecordsRepository.GetByUsername(parameters.Username)

		if error != nil {
			occuringErrors = append(occuringErrors, customErrors.ServerError)
			return StartRegistrationOutput{ Errors: occuringErrors }
		}

		if temporaryUserRecord.Username == parameters.Username {

			occuringErrors = append(occuringErrors, customErrors.SomeoneElseRegisteringWithUsernameError)
			return StartRegistrationOutput{ Errors: occuringErrors }
		}

	otp := generateOTP( )

	error= instance.TemporaryUserRecordsRepository.Save(
		entities.TemporaryUserRecord{

			OTP: otp,
			Email: parameters.Email,
			Username: parameters.Username,
			Name: parameters.Name,
			Password: parameters.Password,
			DeviceIP: parameters.DeviceIP,
		},
	);
		if error != nil {
			occuringErrors = append(occuringErrors, customErrors.ServerError)
			return StartRegistrationOutput{ Errors: occuringErrors }
		}

	return StartRegistrationOutput{ Errors: occuringErrors }
}