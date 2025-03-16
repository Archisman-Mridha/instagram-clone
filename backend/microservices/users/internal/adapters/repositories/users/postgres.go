package users

import (
	"context"
	"database/sql"
	"errors"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/adapters/repositories/users/generated"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/constants"
	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/core/types"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/connectors"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
)

type UsersRepositoryAdapter struct {
	*connectors.PostgresConnector
	queries *generated.Queries
}

func NewUsersRepositoryAdapter(ctx context.Context,
	args *connectors.NewPostgresConnectorArgs,
) *UsersRepositoryAdapter {
	postgresConnector := connectors.NewPostgresConnector(ctx, args)

	queries := generated.New(postgresConnector.GetConnection())

	return &UsersRepositoryAdapter{
		postgresConnector,
		queries,
	}
}

func (u *UsersRepositoryAdapter) Create(ctx context.Context,
	args *coreTypes.CreateUserArgs,
) (sharedTypes.ID, error) {
	userID, err := u.queries.CreateUser(ctx, generated.CreateUserParams{
		Name:     args.Name,
		Email:    args.Email,
		Username: args.Username,
		Password: args.HashedPassword,
	})
	if err != nil {
		pgErr := err.(*pgconn.PgError)
		if pgErr.Code == pgerrcode.UniqueViolation {
			switch pgErr.ColumnName {
			case "email":
				return 0, constants.ErrDuplicateEmail

			case "username":
				return 0, constants.ErrDuplicateUsername
			}
		}

		return 0, sharedUtils.WrapError(err)
	}
	return userID, nil
}

func (u *UsersRepositoryAdapter) FindByEmail(ctx context.Context,
	email string,
) (*coreTypes.FindUserByOperationOutput, error) {
	userDetails, err := u.queries.FindUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(sql.ErrNoRows, err) {
			return nil, constants.ErrUserNotFound
		}

		return nil, sharedUtils.WrapError(err)
	}

	output := &coreTypes.FindUserByOperationOutput{
		ID:             userDetails.ID,
		HashedPassword: userDetails.Password,
	}
	return output, nil
}

func (u *UsersRepositoryAdapter) FindByUsername(ctx context.Context,
	username string,
) (*coreTypes.FindUserByOperationOutput, error) {
	userDetails, err := u.queries.FindUserByUsername(ctx, username)
	if err != nil {
		if errors.Is(sql.ErrNoRows, err) {
			return nil, constants.ErrUserNotFound
		}

		return nil, sharedUtils.WrapError(err)
	}

	output := &coreTypes.FindUserByOperationOutput{
		ID:             userDetails.ID,
		HashedPassword: userDetails.Password,
	}
	return output, nil
}

func (u *UsersRepositoryAdapter) UserIDExists(ctx context.Context, id sharedTypes.ID) (bool, error) {
	_, err := u.queries.FindUserByID(ctx, id)
	if err != nil {
		if errors.Is(sql.ErrNoRows, err) {
			return false, constants.ErrUserNotFound
		}

		return false, sharedUtils.WrapError(err)
	}
	return true, nil
}
