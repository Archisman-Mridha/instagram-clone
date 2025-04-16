package config

import (
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/connectors"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
)

type (
	Config struct {
		DevMode      bool `yaml:"devMode" default:"False"`
		DebugLogging bool `yaml:"debugLogging" default:"False"`

		ServerPort int `yaml:"serverPort" default:"4000" validate:"gt=0"`

		Postgres                 connectors.NewPostgresConnectorArgs  `yaml:"postgres" validate:"required"`
		OpenTelemetryCollectrURL string                               `yaml:"openTelemetryCollectorURL" validate:"required,notblank"`
		Flagsmith                sharedUtils.GetOpenFeatureClientArgs `yaml:"flagsmith" validate:"required"`
	}
)
