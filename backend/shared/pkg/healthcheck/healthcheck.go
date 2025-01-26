package healthcheck

import (
	"errors"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
)

type (
	HealthcheckFn = func() error

	Healthcheckable interface {
		Healthcheck() error
	}
)

// Checks health for each of the given health-checkable entities.
func Healthcheck(healthcheckables []Healthcheckable) (joinedErrors error) {
	for _, healthcheckable := range healthcheckables {
		if err := healthcheckable.Healthcheck(); err != nil {
			errors.Join(joinedErrors, err)
		}
	}

	if joinedErrors != nil {
		utils.WrapError("Healthcheck failed", joinedErrors)
	}

	return
}
