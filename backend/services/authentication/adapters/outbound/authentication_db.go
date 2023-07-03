package outbound_adapters

import (
	"context"
	"database/sql"
	"errors"
	"log"

	shared_utils "github.com/Archisman-Mridha/instagram-clone/backend/shared/utils"
	_ "github.com/lib/pq"

	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/ports"
	sql_generated "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/sql/generated"
)

type AuthenticationDB struct {
	connection *sql.DB
	queries    *sql_generated.Queries
}

func (a *AuthenticationDB) Connect() {
	var err error

	uri := shared_utils.GetEnv("POSTGRES_URL")
	if a.connection, err = sql.Open("postgres", uri); err != nil {
		log.Fatalf("💀 Error connecting to PostgreSQL cluster: %v", err)
	}
	if err = a.connection.Ping(); err != nil {
		log.Fatalf("💀 Error pinging PostgreSQL cluster: %v", err)
	}

	log.Printf("🔥 Connected to PostgreSQL clusQL_CLUSTERter")

	a.queries = sql_generated.New(a.connection)
}

func (a *AuthenticationDB) Disconnect() {
	if err := a.connection.Close(); err != nil {
		log.Printf("💀 Error closing connection to PostgreSQL cluster: %v", err)
	}
}

func (a *AuthenticationDB) IsEmailPreRegisteredByVerifiedUser(email string) (bool, error) {

	var result bool

	_, err := a.queries.FindVerifiedUserWithEmail(context.Background(), email)
	if err != nil {

		// If no rows are found, it indicates that no verified user exists with the given email.
		if errors.Is(err, sql.ErrNoRows) {
			result = false
			err = nil
		}
		// Otherwise some database error has occured
		return result, err
	}

	return true, nil

}

func (a *AuthenticationDB) SaveNewUser(details *ports.UserDetails) (string, error) {

	id, err := a.queries.SaveUnverifiedUser(context.Background(),
		sql_generated.SaveUnverifiedUserParams{
			Name:  details.Name,
			Email: details.Email,
		},
	)

	return string(id), err

}
