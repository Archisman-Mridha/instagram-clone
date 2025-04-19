package validators

import (
	"errors"

	"github.com/go-playground/validator/v10"
)

func DescriptionFieldValidator(fieldLevel validator.FieldLevel) bool {
	err := ValidateDescription(fieldLevel.Field().String())
	return (err == nil)
}

func ValidateDescription(description string) error {
	descriptionLen := len(description)
	if (descriptionLen < 2) || (descriptionLen > 250) {
		return errors.New("description must be between 2 - 250 characters long")
	}

	return nil
}
