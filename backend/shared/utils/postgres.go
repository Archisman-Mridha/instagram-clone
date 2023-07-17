package shared_utils

import (
	"database/sql"
	"log"

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

	log.Printf("Connected to PostgreSQL")

	return connection
}
