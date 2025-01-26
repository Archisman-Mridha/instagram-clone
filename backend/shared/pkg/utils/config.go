package utils

import (
	"context"
	"log/slog"
	"os"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/go-playground/validator/v10"
	"github.com/mcuadros/go-defaults"
	"gopkg.in/yaml.v3"
)

// Parses and validates the config file at the given path.
// The parsed config is then returned.
//
// Panics if any error occurs.
func MustParseConfigFile[T any](ctx context.Context, configFilePath string) *T {
	configFileContents, err := os.ReadFile(configFilePath)
	assert.AssertErrNil(ctx, err, "Failed reading config file", slog.String("path", configFilePath))

	return MustParseConfig[T](ctx, configFileContents)
}

// Parses and validates the given unmarshalled config.
// The parsed config is then returned.
//
// Panics if any error occurs.
func MustParseConfig[T any](ctx context.Context, unparsedConfig []byte) *T {
	config := new(T)

	err := yaml.Unmarshal(unparsedConfig, config)
	assert.AssertErrNil(ctx, err, "Failed YAML unmarshalling config")

	// Required fields must be set.
	err = validator.New(validator.WithRequiredStructEnabled()).Struct(config)
	assert.AssertErrNil(ctx, err, "Config validation failed")

	// Populate optional fields with corresponding default values.
	defaults.SetDefaults(config)

	return config
}
