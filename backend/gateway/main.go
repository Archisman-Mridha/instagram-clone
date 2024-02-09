package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/autometrics-dev/autometrics-go/prometheus/autometrics"
	"github.com/charmbracelet/log"
	"github.com/go-chi/chi"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.opentelemetry.io/otel/sdk/trace"
	"golang.org/x/sync/errgroup"

	"github.com/Archisman-Mridha/instagram-clone/backend/gateway/connectors"
	graphql_generated "github.com/Archisman-Mridha/instagram-clone/backend/gateway/generated/graphql"
	"github.com/Archisman-Mridha/instagram-clone/backend/gateway/utils"
)

var (
	usersMicroserviceConnector       *connectors.UsersMicroserviceConnector
	profilesMicroserviceConnector    *connectors.ProfilesMicroserviceConnector
	followshipsMicroserviceConnector *connectors.FollowshipsMicroserviceConnector
	postsMicroserviceConnector       *connectors.PostsMicroserviceConnector
	feedsMicroserviceConnector       *connectors.FeedsMicroserviceConnector

	shutdownMetricsServer context.CancelCauseFunc

	tracerProvider *trace.TracerProvider
)

func main() {
	log.SetReportCaller(true)

	utils.LoadEnvs()

	waitGroup, waitGroupContext := errgroup.WithContext(context.Background())

	// Listen for system interruption signals to do gracefull shutdown.
	waitGroup.Go(func() error {
		shutdownSignalChan := make(chan os.Signal, 1)

		signal.Notify(shutdownSignalChan, os.Interrupt, syscall.SIGTERM)
		defer signal.Stop(shutdownSignalChan)

		var err error = nil
		select {
		case <-waitGroupContext.Done():
			err = waitGroupContext.Err()

		case <-shutdownSignalChan:
			log.Warn("Received program interruption signal")
		}

		cleanup()

		return err
	})

	var err error
	shutdownMetricsServer, err = autometrics.Init(autometrics.WithService("gateway"))
	if err != nil {
		log.Fatalf("ERROR : Initializing autometrics : %v", err)
	}

	tracerProvider = startTracer()

	usersMicroserviceConnector = connectors.NewUsersMicroserviceConnector()
	profilesMicroserviceConnector = connectors.NewProfilesMicroserviceConnector()
	followshipsMicroserviceConnector = connectors.NewFollowshipsMicroserviceConnector()
	postsMicroserviceConnector = connectors.NewPostsMicroserviceConnector()
	feedsMicroserviceConnector = connectors.NewFeedsMicroserviceConnector()

	waitGroup.Go(func() error {
		router := chi.NewRouter()
		router.Use(authenticationMiddleware)

		router.Handle("/metrics", promhttp.Handler())

		graphqlServer := handler.NewDefaultServer(
			graphql_generated.NewExecutableSchema(graphql_generated.Config{
				Resolvers: &graphql_generated.Resolver{

					UsersMicroservice:       usersMicroserviceConnector,
					ProfilesMicroservice:    profilesMicroserviceConnector,
					FollowshipsMicroservice: followshipsMicroserviceConnector,
					PostsMicroservice:       postsMicroserviceConnector,
					FeedsMicroservice:       feedsMicroserviceConnector,

					Tracer: tracerProvider.Tracer("gateway"),
				},
			}),
		)
		router.Handle("/graphql", graphqlServer)

		router.Handle("/graphiql", playground.ApolloSandboxHandler("GraphQL Playground", "/graphql"))
		log.Debugf("GraphQL playground can be accessed at http://localhost:%s/graphiql", utils.Envs.GRAPHQL_SERVER_PORT)

		log.Debugf("Starting GraphQL server")
		listeningAddress := fmt.Sprintf(":%s", utils.Envs.GRAPHQL_SERVER_PORT)
		return http.ListenAndServe(listeningAddress, router)
	})

	if err := waitGroup.Wait(); err != nil {
		log.Errorf("Application error occurred : %v", err)
	}
}

func cleanup() {
	// Disconnect microservices.
	usersMicroserviceConnector.Disconnect()
	profilesMicroserviceConnector.Disconnect()
	followshipsMicroserviceConnector.Disconnect()
	postsMicroserviceConnector.Disconnect()
	feedsMicroserviceConnector.Disconnect()

	// Shutdown metrics server.
	if shutdownMetricsServer != nil {
		shutdownMetricsServer(nil)
		log.Debug("Metrics server shut down")
	}

	// Shutdown tracer provider.
	if tracerProvider != nil {
		if err := tracerProvider.Shutdown(context.Background()); err != nil {
			log.Errorf("ERROR : Shutting down tracer provider : %v", err)
			log.Debug("Tracer provider shut down")
		}
	}
}
