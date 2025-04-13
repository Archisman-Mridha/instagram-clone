package constants

import "time"

const SERVICE_NAME = "profiles-microservice"

// Flags.
const (
	FLAG_CONFIG_FILE         = "config-file"
	FLAG_CONFIG_FILE_DEFAULT = "/var/profiles-microservice/config.yaml"
)

const MAX_RECORDS_PER_EVENT_STREAMER_POLL = 1000

const SEARCH_ENGINE_INDEX_PROFILES = "profiles"

const RESOURCES_CLEANUP_TIMEOUT = 2 * time.Second
