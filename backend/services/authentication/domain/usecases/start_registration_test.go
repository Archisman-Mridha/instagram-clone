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
		primaryDB = mock_ports.NewMockPrimaryDB(gomockController)

		usecasesLayer = Usecases{PrimaryDB: primaryDB}

		parameters = &StartRegistrationParameters{
			Email: faker.Email(),
		}
	)

	t.Run("🧪 Should throw error if parameters are invalid", func(t *testing.T) {
		output, err := usecasesLayer.StartRegistration(
			&StartRegistrationParameters{
				Email: "archi.procoder",
			},
		)

		assert.Nil(t, output)

		t.Log(err.Error())

		assert.ErrorContains(t, err, "email: must be a valid email address")
	})

	t.Run("🧪 Should throw error if a verified user already registered with that email", func(t *testing.T) {

		primaryDB.EXPECT().IsEmailPreRegisteredByVerifiedUser(parameters.Email).
			Return(true, nil)

		output, err := usecasesLayer.StartRegistration(parameters)

		assert.Nil(t, output)
		assert.ErrorContains(t, err, error_messages.EmailPreRegistered)
	})

	// This covers both the scenarios -
	// 1. Previously a user registered with that email but didn't get verified.
	// 2. No user registered with that email previously.
	t.Run("🧪 Should run successfully", func(t *testing.T) {

		primaryDB.EXPECT().IsEmailPreRegisteredByVerifiedUser(parameters.Email).
			Return(false, nil)
		primaryDB.EXPECT().SaveNewUser(gomock.Any()).
			Return(gomock.Any().String(), nil)

		output, errorMessage := usecasesLayer.StartRegistration(parameters)

		assert.Nil(t, output)
		assert.Nil(t, errorMessage)
	})
}
