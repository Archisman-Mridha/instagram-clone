package usecases

import ports "AuthenticationMicroservice/Domain/Ports"

type Usecases struct {

	UsersRepository ports.UsersRepository
	TemporaryUserRecordsRepository ports.TemporaryUserRecordsRepository

}