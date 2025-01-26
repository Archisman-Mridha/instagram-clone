package versioning

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	flagsmithClient "github.com/Flagsmith/flagsmith-go-client/v3"
	otelhooks "github.com/open-feature/go-sdk-contrib/hooks/open-telemetry/pkg"
	flagsmith "github.com/open-feature/go-sdk-contrib/providers/flagsmith/pkg"
	"github.com/open-feature/go-sdk/openfeature"
)

// Connects to Flagsmith and returns the corresponding Open Feature client.
func GetOpenFeatureClient(ctx context.Context, apiKey string, clientName string) *openfeature.Client {
	flagsmithClient := flagsmithClient.NewClient(apiKey)

	openFeatureProvider := flagsmith.NewProvider(flagsmithClient,
		flagsmith.WithUsingBooleanConfigValue(),
	)

	err := openfeature.SetProvider(openFeatureProvider)
	assert.AssertErrNil(ctx, err, "Failed setting OpenFeature provider to Flagsmith")

	// The OpenTelemetry hooks are responsible for generating metrics and a span for each feature
	// flag evaluation.
	{
		metricsHook, err := otelhooks.NewMetricsHook()
		assert.AssertErrNil(ctx, err, "Failed creating OpenTelemetry metrics hook")

		openfeature.AddHooks(
			metricsHook,
			otelhooks.NewTracesHook(otelhooks.WithErrorStatusEnabled()),
		)
	}

	openFeatureClient := openfeature.NewClient(clientName)
	return openFeatureClient
}
