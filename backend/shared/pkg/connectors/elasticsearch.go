package connectors

import (
	"compress/gzip"
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/elastic/elastic-transport-go/v8/elastictransport"
	"github.com/elastic/go-elasticsearch/v8"
)

type (
	ElasticsearchConnector struct {
		client *elasticsearch.Client
	}

	NewElasticsearchConnectorArgs struct {
		NodeAddresses []string `yaml:"nodeAddresses" validate:"required,gt=0,dive,notblank"`

		Username string `yaml:"username" validate:"required,notblank"`
		Password string `yaml:"password" validate:"required,notblank"`

		DebugLoggingEnabled,
		DevModeEnabled bool
	}
)

func NewElasticsearchConnector(ctx context.Context,
	args *NewElasticsearchConnectorArgs,
) *ElasticsearchConnector {
	var logger elastictransport.Logger = &elastictransport.JSONLogger{
		Output:             os.Stderr,
		EnableRequestBody:  true,
		EnableResponseBody: true,
	}
	if args.DevModeEnabled {
		logger = &elastictransport.ColorLogger{
			Output:             os.Stderr,
			EnableRequestBody:  true,
			EnableResponseBody: true,
		}
	}

	client, err := elasticsearch.NewClient(elasticsearch.Config{
		Addresses: args.NodeAddresses,

		Username: args.Username,
		Password: args.Password,

		CompressRequestBody:      true,
		CompressRequestBodyLevel: gzip.DefaultCompression,

		EnableDebugLogger: args.DebugLoggingEnabled,
		Logger:            logger,
		EnableMetrics:     true,
		Instrumentation:   elasticsearch.NewOpenTelemetryInstrumentation(nil, true), // The global trace-provider is used.
	})
	assert.AssertErrNil(ctx, err, "Failed creating Elasticsearch client")

	response, err := client.Ping()
	assert.Assert(ctx,
		((err == nil) && (response.StatusCode == http.StatusOK)),
		"Failed pinging Elasticsearch client",
	)

	slog.DebugContext(ctx, "Connected to Elasticsearch cluster")

	return &ElasticsearchConnector{client}
}

func (e *ElasticsearchConnector) GetClient() *elasticsearch.Client {
	return e.client
}

func (e *ElasticsearchConnector) Healthcheck() error {
	response, err := e.client.Ping()
	if err != nil {
		return sharedUtils.WrapErrorWithPrefix("Failed pinging Elasticsearch cluster", err)
	}
	if response.StatusCode != http.StatusOK {
		return sharedUtils.WrapErrorWithPrefix(
			fmt.Sprintf("Elasticsearch healthcheck failed. Received response : %v", response),
			nil,
		)
	}
	return nil
}

// The Elasticsearch Go client is stateless by nature, hence why, we don't need to do anything.
// Still, if you want, you can use your own HTTP transport while constructing the Elasticseach
// client, and then close the HTTP transport's idle connections in Shutdown( ).
// REFERENCE : https://discuss.elastic.co/t/how-to-close-the-connection-using-go-client/350123.
func (e *ElasticsearchConnector) Shutdown() {}
