package types

type (
	UsersRepository interface {
		create()

		findByEmail()
		findByUsername()
		findByID()
	}
)
