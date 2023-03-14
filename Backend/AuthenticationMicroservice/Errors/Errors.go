package customErrors

var (
	ServerError = "Server error occured"

	DuplicateEmailError string = "Email already exists"
	DuplicateUsernameError string = "Username already exists"

	SomeoneElseRegisteringWithUsernameError string = "Someone else is registering with the same username"
	SomeoneElseRegisteringWithEmailError string =
												"Someone else is registering with the same email from a different device"
)