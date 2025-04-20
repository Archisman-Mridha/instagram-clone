package constants

import "time"

const SERVICE_NAME = "followships-microservice"

// Flags.
const (
	FLAG_CONFIG_FILE         = "config-file"
	FLAG_CONFIG_FILE_DEFAULT = "/var/followships-microservice/config.yaml"
)

const RESOURCES_CLEANUP_TIMEOUT = 2 * time.Second
