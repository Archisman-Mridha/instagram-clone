package outbound_adapters

import (
	"context"
	"database/sql"
	"errors"

	protoc_generated "github.com/Archisman-Mridha/instagram-clone/backend/proto/generated"
	shared_utils "github.com/Archisman-Mridha/instagram-clone/backend/shared/utils"
	event_types "github.com/Archisman-Mridha/instagram-clone/backend/shared/utils/event-types"
	"github.com/charmbracelet/log"
	"github.com/golang/protobuf/proto"
	"github.com/lainio/err2"
	"github.com/lainio/err2/try"

	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/ports"
	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/utils"
	sqlc_generated "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/sql/generated"
)

type AuthenticationDB struct {
	connection *sql.DB
	queries    *sqlc_generated.Queries
}

func NewAuthenticationDB(uri string) *AuthenticationDB {
	a := &AuthenticationDB{}

	a.connection = shared_utils.ConnectPostgres(uri)
	a.queries = sqlc_generated.New(a.connection)

	return a
}

func (a *AuthenticationDB) Disconnect() {
	if err := a.connection.Close(); err != nil {
		log.Errorf("Error closing connection to PostgreSQL cluster: %v", err)
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
		log.Errorf("Error while executing SQL query: %v", err)
		return result, err
	}

	return true, nil
}

func (a *AuthenticationDB) IsUsernameTaken(username string) (bool, error) {
	_, err := a.queries.FindUserWithUsername(context.Background(), username)
	if err != nil {
		var result bool

		// If no rows are found, it indicates that the username is not taken.
		if errors.Is(err, sql.ErrNoRows) {
			result = false
			err = nil
		}
		// Otherwise some database error has occured
		log.Errorf("Error while executing SQL query: %v", err)
		return result, err
	}

	return true, nil
}

func (a *AuthenticationDB) SaveNewUser(details *ports.UserDetails) error {
	type QueryExecutionOutput struct{}
	executeQueries := func(transaction *sql.Tx) (output *QueryExecutionOutput, err error) {
		defer err2.Handle(&err)

		queries := sqlc_generated.New(transaction)

		try.To(
			queries.SaveUnverifiedUser(context.Background(),
				sqlc_generated.SaveUnverifiedUserParams{
					Email:    details.Email,
					Username: details.Username,
					Password: details.Password,
				},
			),
		)

		event := &protoc_generated.UserRegistrationStartedEvent{
			EventType: event_types.UserRegistrationStarted,
			Email:     details.Email,
			Username:  details.Username,
		}
		message := try.To1[[]byte](proto.Marshal(event))

		try.To(
			queries.InsertMessage(context.Background(), message),
		)

		return
	}

	_, err := shared_utils.ExecuteSQLTransaction[*QueryExecutionOutput](a.connection, executeQueries, nil, utils.Logger)
	return err
}
