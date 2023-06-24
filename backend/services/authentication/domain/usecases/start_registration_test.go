package usecases

import (
	"fmt"
	"testing"

	"github.com/bxcodec/faker/v3"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"

	"github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/domain/utils"
	mock_ports "github.com/Archisman-Mridha/instagram-clone/backend/services/authentication/mocks/domain/ports"
)

func TestStartRegistration(t *testing.T) {

	t.Parallel( )

	gomockController := gomock.NewController(t)
	defer gomockController.Finish( )

	var (
		primaryDB= mock_ports.NewMockPrimaryDB(gomockController)

		usecasesLayer= Usecases{
			PrimaryDB: primaryDB,
		}

		parameters= &StartRegistrationParameters{
			Name: fmt.Sprintf("%s %s", faker.FirstName( ), faker.LastName( )),
			Email: faker.Email( ),
		}
	)

	t.Run("Should throw error if parameters are invalid", func(t *testing.T) {

		output, err := usecasesLayer.StartRegistration(
			&StartRegistrationParameters{
				Email: "archi.procoder",
			},
		)

		assert.Nil(t, output)

		t.Log(err.Error( ))

		assert.ErrorContains(t, err, "name: cannot be blank")
		assert.ErrorContains(t, err, "email: must be a valid email address")
	})

	t.Run("Should throw error if a user already registered with that email and got verified", func(t *testing.T) {

		primaryDB.EXPECT( ).IsEmailPreRegisteredByVerifiedUser(parameters.Email).
			Return(true, nil)

		output, err := usecasesLayer.StartRegistration(parameters)

		assert.Nil(t, output)
		assert.ErrorContains(t, err, utils.EmailPreRegisteredErrMsg)
	})

	t.Run("Should run successfully", func(t *testing.T) {

		primaryDB.EXPECT( ).IsEmailPreRegisteredByVerifiedUser(parameters.Email).
			Return(false, nil)
		primaryDB.EXPECT( ).SaveNewUser(gomock.Any( )).
			Return(nil)

		output, errorMessage := usecasesLayer.StartRegistration(parameters)

		assert.Nil(t, output)
		assert.Nil(t, errorMessage)
	})

}