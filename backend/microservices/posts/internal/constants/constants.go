package constants

import "time"

// Environment variables.
const (
	ENV_CONFIG_FILE = "CONFIG_FILE"
)

// Miscellaneous
const (
	SERVICE_NAME    = "posts-microservice"
	SERVICE_VERSION = "v1.0.0"

	HEALTHCHECK_FREQUENCY = 5 * time.Second

	RESOURCES_CLEANUP_TIMEOUT = 2 * time.Second
)
