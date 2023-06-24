package ports

type (
	PrimaryDB interface {

		// IsEmailPreRegisteredByVerifiedUser returns whether a verified user already exists with the
		// given email address.
		IsEmailPreRegisteredByVerifiedUser(email string) (result bool, err error)

		// SaveNewUser takes in details of the new user and creates a record in the authentication
		// database. The user is marked as unverified.
		SaveNewUser(details *UserDetails) (err error)

	}

	Cache interface { }
)

type UserDetails struct {
	Name string
	Email string
}