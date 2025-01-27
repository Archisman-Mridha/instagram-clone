package usecases

type SignupArgs struct {
	Name,
	Email,
	Username,
	Password string
}

func (u *Usecases) Signup(args SignupArgs) SigninOutput {
	return SigninOutput{}
}
