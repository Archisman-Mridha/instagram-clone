package ports

import entities "AuthenticationMicroservice/Domain/Entities"

type UsersRepository interface {

	FindByEmailOrUsername(email string, username string) ([ ]entities.UserEntity, error)

}

type TemporaryUserRecordsRepository interface {

	Save(temporaryUserRecord entities.TemporaryUserRecord) error
	GetByEmail(email string) (entities.TemporaryUserRecord, error)
	GetByUsername(username string) (entities.TemporaryUserRecord, error)

}