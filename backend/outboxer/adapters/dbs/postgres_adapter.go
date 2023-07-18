package dbs

import (
	"context"
	"database/sql"
	"log"
	"strconv"

	shared_utils "github.com/Archisman-Mridha/instagram-clone/backend/shared/utils"

	sqlc_generated "github.com/Archisman-Mridha/outboxer/adapters/dbs/sql/generated"
	"github.com/Archisman-Mridha/outboxer/domain/ports"
)

type PostgresAdapter struct {
	connection *sql.DB
	queries    *sqlc_generated.Queries
}

func NewPostgresAdapter(uri string) *PostgresAdapter {
	p := &PostgresAdapter{}

	p.connection = shared_utils.ConnectPostgres(uri)
	p.queries = sqlc_generated.New(p.connection)

	return p
}

func (p *PostgresAdapter) Disconnect() {
	if err := p.connection.Close(); err != nil {
		log.Printf("Error closing connection to the database: %v", err)
	}
}

func (p *PostgresAdapter) GetMessages(args *ports.GetMessagesArgs) {
	rows, err := p.queries.GetUnpublishedMessages(context.Background(), int32(args.BatchSize))
	if err != nil {
		if err != sql.ErrNoRows {
			log.Printf("Error executing SQL query : %v", err)
		}
		return
	}

	for _, row := range rows {
		args.ToBePublishedItemsChan <- &ports.ToBePublishedItem{
			RowId:   string(row.ID),
			Message: row.Message,
		}
	}
}

func (p *PostgresAdapter) UnlockMessagesFailedTobePublished(args *ports.UnlockMessagesFailedTobePublishedArgs) {
	for idAsString := range args.ItemsFailedTobePublishedChan {
		id, _ := strconv.Atoi(idAsString)
		if err := p.queries.UnlockMessagesFailedTobePublished(context.Background(), int32(id)); err != nil {
			log.Printf("Error executing SQL query: %v", err)
		}
	}
}

func (p *PostgresAdapter) Clean() {
	if err := p.queries.DeleteRowsWithPublishedMessages(context.Background()); err != nil {
		log.Printf("Error executing SQL query : %v", err)
	}
}
