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
func MustParseConfigFile[T any](ctx context.Context, configFilePath string, validator *validator.Validate) *T {
	configFileContents, err := os.ReadFile(configFilePath)
	assert.AssertErrNil(ctx, err, "Failed reading config file", slog.String("path", configFilePath))

	return MustParseConfig[T](ctx, configFileContents, validator)
}

// Parses and validates the given unmarshalled config.
// The parsed config is then returned.
//
// Panics if any error occurs.
func MustParseConfig[T any](ctx context.Context, unparsedConfig []byte, validator *validator.Validate) *T {
	config := new(T)

	err := yaml.Unmarshal(unparsedConfig, config)
	assert.AssertErrNil(ctx, err, "Failed YAML unmarshalling config")

	// Validate based on struct tags.
	err = validator.Struct(config)
	assert.AssertErrNil(ctx, err, "Config validation failed")

	// Populate optional fields with corresponding default values.
	defaults.SetDefaults(config)

	return config
}
