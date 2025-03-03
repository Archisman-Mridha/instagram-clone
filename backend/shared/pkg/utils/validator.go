package utils

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/go-playground/validator/v10"
	goNonStandardValidtors "github.com/go-playground/validator/v10/non-standard/validators"
)

func NewValidator(ctx context.Context) *validator.Validate {
	validator := validator.New(validator.WithRequiredStructEnabled())

	err := validator.RegisterValidation("notblank", goNonStandardValidtors.NotBlank)
	assert.AssertErrNil(ctx, err, "Failed registering notblank validator")

	return validator
}

type CustomValidators = map[string]validator.Func

func RegisterCustomValidators(validator *validator.Validate, customValidators CustomValidators) {
	for id, validatorFn := range customValidators {
		validator.RegisterValidation(id, validatorFn, false)
	}
}
