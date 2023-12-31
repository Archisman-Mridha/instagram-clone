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

	"github.com/Archisman-Mridha/instagram-clone/backend/gateway/connectors"
	graphql_generated "github.com/Archisman-Mridha/instagram-clone/backend/gateway/generated/graphql"
	grpc_generated "github.com/Archisman-Mridha/instagram-clone/backend/gateway/generated/grpc"
	"github.com/Archisman-Mridha/instagram-clone/backend/gateway/utils"
)

var usersMicroserviceConnector *connectors.UsersMicroserviceConnector

func main( ) {
	log.SetReportCaller(true)

	utils.LoadEnvs( )

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

		cleanup( )

		return err
	})

	usersMicroserviceConnector= connectors.NewUsersMicroserviceConnector( )

	waitGroup.Go(func( ) error {
		graphqlServer := handler.NewDefaultServer(
			graphql_generated.NewExecutableSchema(graphql_generated.Config {
				Resolvers: &graphql_generated.Resolver { },
			}),
		)
	
		router := chi.NewRouter( )

		router.Use(authenticationMiddleware)

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

func cleanup( ) {
	if usersMicroserviceConnector != nil {
		usersMicroserviceConnector.Disconnect( )}
}

// authenticationMiddleware will verify the JWT (if present) in the 'Authorization' header, present
// in the form of a Bearer Token.
func authenticationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authorizationHeader := r.Header.Get("Authorization")
		if len(authorizationHeader) == 0 {
			next.ServeHTTP(w, r)
			return
		}

		jwt, err := utils.ExtractJwtFromAuthorizationHeader(authorizationHeader)
		if err != nil {
			http.Error(w, err.Error( ), http.StatusBadRequest)
			return
		}

		// TODO: Add a timeout.
		response, err := usersMicroserviceConnector.VerifyJwt(context.Background( ),
																													&grpc_generated.VerifyJwtRequest{ Jwt: jwt })
		if err != nil {
			http.Error(w, "server error occurred", http.StatusInternalServerError)
			return
		}

		// Add the user-id in context.
		ctx := context.WithValue(r.Context( ), utils.USER_ID_CONTEXT_KEY, response.UserId)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}