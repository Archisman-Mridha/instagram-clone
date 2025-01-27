package config

type Config struct {
	DebugLogging bool `yaml:"debugLogging" default:"False"`

	DevMode bool `yaml:"devMode" default:"False"`

	GRPCServerPort int `yaml:"gRPCServerPort" default:"4000"`

	HTTPMetricsServerPort int `yaml:"httpMetricsServerPort" default:"9000"`

	FlagsmithAPIKey string `yaml:"flagsmithAPIKey" validate:"required"`

	JaegerURL string `yaml:"jaegerURL" validate:"required"`
}
