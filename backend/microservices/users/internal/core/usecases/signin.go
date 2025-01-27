package usecases

import "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"

type (
	SigninArgs struct {
		Identifier string
		Password   string
	}

	SigninOutput struct {
		ID  types.ID
		JWT string
	}
)

func (u *Usecases) Signin(args SigninArgs) SigninOutput {
	return SigninOutput{}
}
