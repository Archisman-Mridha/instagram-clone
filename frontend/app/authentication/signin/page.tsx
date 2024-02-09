import { NextPage } from "next"
import { Fragment } from "react"
import { SigninForm } from "./signin-form.component"
import Link from "next/link"

const SigninPage: NextPage = () => {
	return (
		<Fragment>
			<div className="flex shrink-0 flex-col w-full min-h-screen items-center justify-center">
				<div className="w-full max-w-[400px]">

					<h1 className="text-2xl font-[700]">Signin</h1>
					<div className="mb-5" />

					<SigninForm />

					<p className="mt-10">
						Or
						<Link href="/authentication/signup" className="text-sky-500 ml-[5px] mr-[5px]">Signup</Link>
						if you don't have an account
					</p>
				</div>
			</div>
		</Fragment>
	)
}
export default SigninPage
