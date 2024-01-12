package main

import (
	"context"
	"net/http"

	grpc_generated "github.com/Archisman-Mridha/instagram-clone/backend/gateway/generated/grpc"
	"github.com/Archisman-Mridha/instagram-clone/backend/gateway/utils"
)

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
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// TODO: Add a timeout.
		response, err := usersMicroserviceConnector.VerifyJwt(context.Background(),
			&grpc_generated.VerifyJwtRequest{Jwt: jwt})
		if err != nil {
			http.Error(w, "server error occurred", http.StatusInternalServerError)
			return
		}

		// Add the user-id in context.
		ctx := context.WithValue(r.Context(), utils.USER_ID_CONTEXT_KEY, response.UserId)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}
