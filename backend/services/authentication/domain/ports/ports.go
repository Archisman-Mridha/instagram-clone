package ports

type (
	PrimaryDB interface {

		// IsEmailPreRegisteredByVerifiedUser returns whether a verified user already exists with the
		// given email address.
		IsEmailPreRegisteredByVerifiedUser(email string) (bool, error)

		// SaveNewUser takes in details of the new user and creates a record in the authentication db.
		// The user is marked as unverified.
		SaveNewUser(details *UserDetails) (string, error)
	}

	Cache interface{}

	MessageSender interface {

		// SendUserRegistrationStartedEvent gets triggered when a new unverified user is created in the
		// authentication db.
		SendUserRegistrationStartedEvent(id string)
	}
)

type UserDetails struct {
	Name  string
	Email string
}
