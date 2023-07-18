package usecases

import (
	"testing"

	"github.com/bxcodec/faker/v3"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"

	error_messages "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/utils/error-messages"
	mock_ports "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/mocks/domain/ports"
)

func TestStartRegistration(t *testing.T) {
	t.Parallel()

	gomockController := gomock.NewController(t)
	defer gomockController.Finish()

	var (
		primaryDB     = mock_ports.NewMockPrimaryDB(gomockController)
		usecasesLayer = Usecases{PrimaryDB: primaryDB}
	)

	parameters := &StartRegistrationParameters{
		Email:    faker.Email(),
		Username: faker.Username(),
		Password: faker.Password(),
	}

	t.Run("🧪 Should throw error if parameters are invalid", func(t *testing.T) {
		err := usecasesLayer.StartRegistration(
			&StartRegistrationParameters{
				Email: "archi.procoder",
			},
		)

		t.Log(err.Error())

		assert.ErrorContains(t, err, "email: must be a valid email address")
	})

	t.Run("🧪 Should throw error if a verified user already registered with that email", func(t *testing.T) {

		primaryDB.EXPECT().IsEmailPreRegisteredByVerifiedUser(parameters.Email).
			Return(true, nil)

		err := usecasesLayer.StartRegistration(parameters)
		assert.ErrorContains(t, err, error_messages.EmailPreRegistered)
	})

	t.Run("🧪 Should throw error if username is taken", func(t *testing.T) {

		primaryDB.EXPECT().IsEmailPreRegisteredByVerifiedUser(parameters.Email).
			Return(false, nil)
		primaryDB.EXPECT().IsUsernameTaken(parameters.Username).
			Return(true, nil)

		err := usecasesLayer.StartRegistration(parameters)
		assert.ErrorContains(t, err, error_messages.UsernameTaken)
	})

	// This testcase covers both the scenarios -
	// 1. Previously a user registered with that email but didn't get verified (That corresponding
	// existing record will get deleted first).
	// 2. No user registered with that email previously.
	t.Run("🧪 Should run successfully", func(t *testing.T) {

		primaryDB.EXPECT().IsEmailPreRegisteredByVerifiedUser(parameters.Email).
			Return(false, nil)
		primaryDB.EXPECT().IsUsernameTaken(parameters.Username).
			Return(false, nil)
		primaryDB.EXPECT().SaveNewUser(gomock.Any()).
			Return(nil)

		err := usecasesLayer.StartRegistration(parameters)
		assert.Nil(t, err)
	})
}
