package constants

import "time"

const SERVICE_NAME = "users-microservice"

const MIN_PASSWORD_ENTROPY = 60

// Flags.
const (
	FLAG_CONFIG_FILE         = "config-file"
	FLAG_CONFIG_FILE_DEFAULT = "/var/users-microservice/config.yaml"
)

const RESOURCES_CLEANUP_TIMEOUT = 2 * time.Second
