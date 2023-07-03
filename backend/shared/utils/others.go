package shared_utils

import (
	"fmt"
	"log"
	"os"
)

// GetEnv looks up the given environment variable. It panics if the env is not found. If the env is
// found, then its value is returned.
func GetEnv(envName string) string {
	envValue, isEnvFound := os.LookupEnv(envName)
	if !isEnvFound {
		log.Fatalf(fmt.Sprintf("💀 Env %s not found", envName))
	}

	return envValue
}
