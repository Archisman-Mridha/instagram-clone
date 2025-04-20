package constants

import "time"

const SERVICE_NAME = "feeds-microservice"

// Flags.
const (
	FLAG_CONFIG_FILE         = "config-file"
	FLAG_CONFIG_FILE_DEFAULT = "/var/feeds-microservice/config.yaml"
)

const RESOURCES_CLEANUP_TIMEOUT = 2 * time.Second
