package shared_utils

import (
	"context"
	"database/sql"

	"github.com/charmbracelet/log"
	_ "github.com/lib/pq"
)

// ConnectPostgres establishes connection with the Postgres DB running at the given uri. If established
// successfully, the connection is returned.
func ConnectPostgres(uri string) *sql.DB {
	connection, err := sql.Open("postgres", uri)
	if err != nil {
		log.Fatalf("Error connecting to PostgreSQL: %v", err)
	}
	if err = connection.Ping(); err != nil {
		log.Fatalf("Error pinging PostgreSQL: %v", err)
	}

	log.Info("Connected to PostgreSQL")

	return connection
}

// ExecuteSQLTransaction starts an SQL transaction. It takes input the executeQueries function which
// using which it executes necessary queries inside the transaction. If any step inside executeQueries
// fails then the transaction is rolled back. Otherwise, after successfull execution of executeQueries
// the transaction is commited.
func ExecuteSQLTransaction[T interface{}](

	connection *sql.DB,
	executeQueries func(transaction *sql.Tx) (T, error),
	defaultReturnValue T,
	logger *log.Logger,

) (T, error) {

	transaction, err := connection.BeginTx(context.Background(), nil)
	if err != nil {
		logger.Errorf("Error while beginning SQL transaction: %v", err)
		return defaultReturnValue, err
	}

	result, err := executeQueries(transaction)
	if err != nil {
		log.Errorf("Error while executing queries inside SQL transaction: %v", err)
		err = transaction.Rollback()
	} else {
		err = transaction.Commit()
	}
	if err != nil {
		log.Errorf("Error while rollling-back/committing SQL transaction: %v", err)
	}

	return result, err
}
