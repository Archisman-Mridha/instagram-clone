import { NextPage } from "next"
import { Fragment } from "react"
import { SignupForm } from "./signup-form.component"

const SignupPage: NextPage = () => {
	return (
		<Fragment>
			<SignupForm />
		</Fragment>
	)
}
export default SignupPage
