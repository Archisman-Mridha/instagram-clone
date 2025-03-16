package connectors

import (
	"context"
	"database/sql"
	"log/slog"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logs/logger"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"

	"github.com/uptrace/opentelemetry-go-extra/otelsql"

	_ "github.com/jackc/pgx/v5/stdlib"
)

type (
	PostgresConnector struct {
		connection *sql.DB
	}

	NewPostgresConnectorArgs struct {
		URL string `yaml:"url" validate:"required,notblank"`
	}
)

func NewPostgresConnector(ctx context.Context, args *NewPostgresConnectorArgs) *PostgresConnector {
	// TODO : use a query logger.
	connection, err := otelsql.Open("pgx", args.URL,
		otelsql.WithAttributes(semconv.DBSystemPostgreSQL),
	)
	assert.AssertErrNil(ctx, err, "Failed connecting to Postgres")

	// Ping the database, verifying that a working connection has been established.
	err = connection.Ping()
	assert.AssertErrNil(ctx, err, "Failed connecting to Postgres")

	slog.DebugContext(ctx, "Connected to Postgres")

	return &PostgresConnector{connection}
}

func (p *PostgresConnector) GetConnection() *sql.DB {
	return p.connection
}

func (p *PostgresConnector) Healthcheck() error {
	if err := p.connection.Ping(); err != nil {
		return sharedUtils.WrapErrorWithPrefix("Failed pinging Postgres", err)
	}
	return nil
}

func (p *PostgresConnector) Shutdown() {
	if err := p.connection.Close(); err != nil {
		slog.Error("Failed closing Postgres connection", logger.Error(err))
		return
	}
	slog.Debug("Shut down Postgres client")
}
