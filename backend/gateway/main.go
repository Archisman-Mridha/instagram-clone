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
	"github.com/charmbracelet/log"
	"github.com/go-chi/chi"
	"golang.org/x/sync/errgroup"

	graphql_generated "github.com/Archisman-Mridha/instagram-clone/backend/gateway/generated/graphql"
	"github.com/Archisman-Mridha/instagram-clone/backend/gateway/utils"
)

func main( ) {
	waitGroup, waitGroupContext := errgroup.WithContext(context.Background( ))

	// Listen for system interruption signals to do gracefull shutdown.
	waitGroup.Go(func( ) error {
		shutdownSignalChan := make(chan os.Signal, 1)

		signal.Notify(shutdownSignalChan, os.Interrupt, syscall.SIGTERM)
		defer signal.Stop(shutdownSignalChan)

		var err error= nil
		select {
			case <- waitGroupContext.Done( ):
				err= waitGroupContext.Err( )

			case <- shutdownSignalChan:
				log.Warn("Received program interruption signal")
		}

		return err
	})

	waitGroup.Go(func( ) error {
		graphqlServer := handler.NewDefaultServer(
			graphql_generated.NewExecutableSchema(graphql_generated.Config {
				Resolvers: &graphql_generated.Resolver { },
			}),
		)
	
		router := chi.NewRouter( )

		router.Handle("/graphql", graphqlServer)
	
		router.Handle("/graphiql", playground.ApolloSandboxHandler("GraphQL Playground", "/graphql"))
		log.Infof("GraphQL playground can be accessed at http://localhost:%s/graphiql", utils.Envs.GRAPHQL_SERVER_PORT)

		log.Infof("Starting GraphQL server")

		listeningAddress := fmt.Sprintf(":%s", utils.Envs.GRAPHQL_SERVER_PORT)
		return http.ListenAndServe(listeningAddress, router)
	})

	if err := waitGroup.Wait( ); err != nil {
		log.Errorf("Application error occurred : %v", err)}
}