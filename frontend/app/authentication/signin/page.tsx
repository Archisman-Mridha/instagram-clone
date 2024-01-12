import { NextPage } from "next"
import { Fragment } from "react"
import { SigninForm } from "./signin-form.component"

const SigninPage: NextPage = () => {
	return (
		<Fragment>
			<SigninForm />
		</Fragment>
	)
}
export default SigninPage
