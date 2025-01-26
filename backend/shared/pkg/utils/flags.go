package utils

import (
	"context"
	"flag"
	"log/slog"
	"os"
	"strings"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logger"
)

type GetFlagOrEnvFn = func(f *flag.Flag)

// Usage : flagSet.VisitAll(getFlagOrEnvValue("USERS_MICROSERVICE_"))
func CreateGetFlagOrEnvValueFn(envPrefix string) GetFlagOrEnvFn {
	// If a flag isn't set, then we try to get its value from the corresponding environment variable.
	//
	// For example, if the flag name is config-file, then the corresponding environment variable is
	// USERS_MICROSERVICE_CONFIG_FILE. USERS_MICROSERVICE_ here is the env-prefix.
	//
	// Panics, if both the flag and environment variable aren't set and a default value isn't set for
	// the flag.
	getFlagOrEnvFn := func(f *flag.Flag) {
		ctx := logger.AppendSlogAttributesToCtx(context.Background(), []slog.Attr{
			slog.String("flag", f.Name),
		})

		if len(f.Value.String()) > 0 {
			return
		}

		// Since the flag is not set, we'll try to get the value from the corresponding environment
		// variable.
		envName := envPrefix + strings.ReplaceAll(strings.ToUpper(f.Name), "-", "_")
		envValue, envFound := os.LookupEnv(envName)
		if envFound {
			err := f.Value.Set(envValue)
			assert.AssertErrNil(context.Background(), err,
				"Failed setting flag value to corresponding env value",
			)

			return
		}

		assert.Assert(ctx, len(f.DefValue) == 0, "Neither flag nor corresponding env was set")
	}

	return getFlagOrEnvFn
}
