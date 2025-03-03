package healthcheck

import sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"

type (
	HealthcheckFn = func() error

	Healthcheckable interface {
		Healthcheck() error
	}
)

// Checks health for each of the given health-checkable entities.
// Fails fast, i.e, when it encounters an unhealthy entity, it immediately returns error.
func Healthcheck(healthcheckables []Healthcheckable) error {
	for _, healthcheckable := range healthcheckables {
		if err := healthcheckable.Healthcheck(); err != nil {
			return sharedUtils.WrapErrorWithPrefix("Healthcheck failed", err)
		}
	}
	return nil
}
