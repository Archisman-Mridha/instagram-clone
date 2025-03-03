package validators

import (
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/constants"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/asaskevich/govalidator"
	"github.com/go-playground/validator/v10"
	passwordvalidator "github.com/wagslane/go-password-validator"
)

func NameValidation(fieldLevel validator.FieldLevel) bool {
	err := ValidateName(fieldLevel.Field().String())
	return (err != nil)
}

func ValidateName(name string) error {
	// name length must be between 3 - 25 characters.
	nameLength := len(name)
	if (nameLength < 3) || (nameLength > 25) {
		return sharedUtils.NewAPIError("name length can be between 3 - 25")
	}

	// name must contain only alphabetic characters.
	if !govalidator.IsAlpha(name) {
		return sharedUtils.NewAPIError("name can only contain alphabetic characters")
	}

	return nil
}

func UsernameValidation(fieldLevel validator.FieldLevel) bool {
	err := ValidateUsername(fieldLevel.Field().String())
	return (err != nil)
}

func ValidateUsername(username string) error {
	// username length must be between 3 - 25 characters.
	usernameLength := len(username)
	if (usernameLength < 3) || (usernameLength > 25) {
		return sharedUtils.NewAPIError("username length can be between 3 - 25")
	}

	// username can contain alphanumeric and underscore characters.
	// And, there must be atleast 1 alphabetic character.
	{
		alphabeticCharacterCount := 0

		for _, characterRune := range username {
			character := string(characterRune)

			if govalidator.IsAlpha(character) {
				alphabeticCharacterCount++
				continue
			}

			if !govalidator.IsNumeric(character) && (character != "_") {
				return sharedUtils.NewAPIError("username can contain only alphanumeric or underscore characters")
			}
		}

		if alphabeticCharacterCount == 0 {
			return sharedUtils.NewAPIError("username must contain atleast one alphabetic character")
		}
	}

	return nil
}

func PasswordValidation(fieldLevel validator.FieldLevel) bool {
	err := ValidatePassword(fieldLevel.Field().String())
	return (err != nil)
}

func ValidatePassword(password string) error {
	// Password must have a high enough entropy.
	/*
		Password entropy refers to how unpredictable your password or phrase is, measured in bits.
		The following factors affect the password entropy :

		  (1) Length (in characters)

		  (2) Use of uppercase and lowercase letters, numeric characters and special symbols

		NOTE : Entropy and complexity aren’t the only password strength factors. Hackers can use
		       dictionary attacks to guess your credentials if you use a recognizable word or common
		       phrase in your password.

		REFERENCE : https://proton.me/blog/what-is-password-entropy.
	*/
	err := passwordvalidator.Validate(password, constants.MIN_PASSWORD_ENTROPY)
	if err != nil {
		return sharedUtils.NewAPIError("password isn't string, having not high enough entropy")
	}

	return nil
}
