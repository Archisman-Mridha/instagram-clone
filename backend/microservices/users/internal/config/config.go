package config

import (
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/connectors"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
)

type (
	Config struct {
		DevMode      bool `yaml:"devMode" default:"False"`
		DebugLogging bool `yaml:"debugLogging" default:"False"`

		GRPCServerPort int `yaml:"gRPCServerPort" default:"4000" validate:"gt=0"`

		JWTSigningKey string `yaml:"jwtSigningKey" validate:"required,notblank"`

		Postgres                 connectors.NewPostgresConnectorArgs  `yaml:"postgres" validate:"required"`
		Redis                    connectors.NewRedisConnectorArgs     `yaml:"redis" validate:"required"`
		OpenTelemetryCollectrURL string                               `yaml:"openTelemetryCollectorURL" validate:"required,notblank"`
		Flagsmith                sharedUtils.GetOpenFeatureClientArgs `yaml:"flagsmith" validate:"required"`
	}
)
