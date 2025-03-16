package validators

import (
	"errors"
	"net/mail"
	"unicode"

	"github.com/go-playground/validator/v10"
)

func NameFieldValidator(fieldLevel validator.FieldLevel) bool {
	err := ValidateName(fieldLevel.Field().String())
	return (err == nil)
}

func ValidateName(name string) error {
	// name length must be between 3 - 25 characters.
	nameLength := len(name)
	if (nameLength < 3) || (nameLength > 25) {
		return errors.New("name length can be between 3 - 25")
	}

	// name must contain only alphabetic characters.
	for _, character := range name {
		if !unicode.IsLetter(character) && (character != ' ') {
			return errors.New("name can only contain alphabetic characters")
		}
	}

	return nil
}

func EmailFieldValidator(fieldLevel validator.FieldLevel) bool {
	err := ValidateEmail(fieldLevel.Field().String())
	return (err == nil)
}

func ValidateEmail(email string) error {
	_, err := mail.ParseAddress(email)
	if err != nil {
		return errors.New("email is invalid")
	}

	return nil
}

func UsernameFieldValidator(fieldLevel validator.FieldLevel) bool {
	err := ValidateUsername(fieldLevel.Field().String())
	return (err == nil)
}

func ValidateUsername(username string) error {
	// username length must be between 3 - 25 characters.
	usernameLength := len(username)
	if (usernameLength < 3) || (usernameLength > 25) {
		return errors.New("username length can be between 3 - 25")
	}

	// username can contain alphanumeric and underscore characters.
	// And, there must be atleast 1 alphabetic character.
	{
		alphabeticCharacterCount := 0

		for _, character := range username {
			if !unicode.IsLetter(character) && !unicode.IsNumber(character) && (character != '_') {
				return errors.New("username can contain only alphanumeric or underscore characters")
			}

			if unicode.IsLetter(character) {
				alphabeticCharacterCount++
				continue
			}
		}

		if alphabeticCharacterCount == 0 {
			return errors.New("username must contain atleast one alphabetic character")
		}
	}

	return nil
}

func PasswordFieldValidator(fieldLevel validator.FieldLevel) bool {
	err := ValidatePassword(fieldLevel.Field().String())
	return (err == nil)
}

// TODO : Validate password based on entropy.
//        There is a very good library for this : passwordvalidator. But, it's not compatible with
//        tinygo.
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
func ValidatePassword(password string) error {
	// username length must be 3 - 25 characters.
	passwordLength := len(password)
	if (passwordLength < 3) || (passwordLength > 25) {
		return errors.New("password must be 3 - 25 characters long")
	}

	// password must contain atleast one special character.
	{
		specialCharacterCount := 0

		for _, character := range password {
			if !unicode.IsLetter(character) && !unicode.IsNumber(character) {
				specialCharacterCount++
			}
		}

		if specialCharacterCount == 0 {
			return errors.New("password must contain atleast one special character")
		}
	}

	return nil
}
