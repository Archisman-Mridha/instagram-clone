package outbound_adapters

import (
	"context"
	"database/sql"
	"errors"
	"log"

	shared_utils "github.com/Archisman-Mridha/instagram-clone/backend/shared/utils"

	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/ports"
	sql_generated "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/sql/generated"
)

type AuthenticationDB struct {
	connection *sql.DB
	queries    *sql_generated.Queries
}

func NewAuthenticationDB(uri string) *AuthenticationDB {
	a := &AuthenticationDB{}

	a.connection = shared_utils.ConnectPostgres(uri)
	a.queries = sql_generated.New(a.connection)

	return a
}

func (a *AuthenticationDB) Disconnect() {
	if err := a.connection.Close(); err != nil {
		log.Printf("Error closing connection to PostgreSQL cluster: %v", err)
	}
}

func (a *AuthenticationDB) IsEmailPreRegisteredByVerifiedUser(email string) (bool, error) {
	_, err := a.queries.FindVerifiedUserWithEmail(context.Background(), email)
	if err != nil {
		var result bool

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
	id, err := a.queries.SaveUnverifiedUser(context.Background(), details.Email)

	return string(id), err
}
