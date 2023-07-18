package shared_utils

import (
	"fmt"
	"os"

	"github.com/charmbracelet/log"
)

// GetEnv looks up the given environment variable. It panics if the env is not found. If the env is
// found, then its value is returned.
func GetEnv(envName string) string {
	envValue, isEnvFound := os.LookupEnv(envName)
	if !isEnvFound {
		log.Fatalf(fmt.Sprintf("Env %s not found", envName))
	}

	return envValue
}

// CreateLogger creates a new logger instance and returns it.
func CreateLogger(prefix string) *log.Logger {
	return log.NewWithOptions(os.Stdout, log.Options{
		ReportCaller: true,
		Prefix:       prefix,
		Level:        log.DebugLevel,
	})
}
