package utils

import (
	"context"
	"log/slog"

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

type CustomFieldValidators = map[string]validator.Func

func RegisterCustomFieldValidators(
	validator *validator.Validate,
	customFieldValidators CustomFieldValidators,
) {
	ctx := context.Background()

	for id, customFieldValidator := range customFieldValidators {
		err := validator.RegisterValidation(id, customFieldValidator, false)
		assert.AssertErrNil(ctx, err, "Failed registering custom field validator", slog.String("id", id))
	}
}
