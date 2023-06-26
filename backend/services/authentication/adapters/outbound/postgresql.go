package outbound_adapters

import (
	"context"
	"database/sql"
	"errors"
	"log"
	"os"

	_ "github.com/lib/pq"

	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/ports"
	sql_generated "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/sql/generated"
)

type Postgresql struct {
  connection *sql.DB
  queries *sql_generated.Queries
}

func(p *Postgresql) Connect( ) {

  var err error

  uri, isEnvFound := os.LookupEnv("AUTHENTICATION_DB_URL")
  if !isEnvFound {
    log.Fatalf("env AUTHENTICATION_DB_URL not found")
  }

  if p.connection, err= sql.Open("postgres", uri); err != nil {
    log.Fatalf("Error connecting to authentication db: %v", err)
  }
  if err= p.connection.Ping( ); err != nil {
    log.Fatalf("Error pinging authentication db: %v", err)
  }

  log.Printf("🔥 Connected to authentication db (PostgreSQL cluster)")

  p.queries= sql_generated.New(p.connection)

}

func(p *Postgresql) Disconnect( ) {
  if err := p.connection.Close( ); err != nil {
    log.Printf("Error closing connection to authentication db: %v", err)
  }
}

func(p *Postgresql) IsEmailPreRegisteredByVerifiedUser(email string) (bool, error) {

  var result bool

  _, err := p.queries.FindVerifiedUserWithEmail(context.Background( ), email)
  if err != nil {

    // If no rows are found, it indicates that no verified user exists with the given email.
    if errors.Is(err, sql.ErrNoRows) {
      result= false
      err= nil
    }
    // Otherwise some database error has occured
    return result, err
  }

  return true, nil

}

func(p *Postgresql) SaveNewUser(details *ports.UserDetails) error {

  return p.queries.SaveUnverifiedUser(context.Background( ),
    sql_generated.SaveUnverifiedUserParams{
      Name: details.Name,
      Email: details.Email,
    },
  )
}