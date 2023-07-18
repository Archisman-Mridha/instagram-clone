package ports

type (
	PrimaryDB interface {

		// IsEmailPreRegisteredByVerifiedUser returns whether a verified user already exists with the
		// given email address or not.
		IsEmailPreRegisteredByVerifiedUser(email string) (bool, error)

		// IsUsernameTaken takes a username as input and returns whether the username is taken or not.
		IsUsernameTaken(username string) (bool, error)

		// SaveNewUser takes in details of the new user and creates a record in the authentication db.
		// The user is marked as unverified.
		// It also saves the 'UserRegistrationStarted' event in the outbox table.
		SaveNewUser(details *UserDetails) error
	}

	Cache interface{}
)

type UserDetails struct {
	Email,
	Username,

	Password string
}
