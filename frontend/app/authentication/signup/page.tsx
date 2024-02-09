import { NextPage } from "next"
import { Fragment } from "react"
import { SignupForm } from "./signup-form.component"
import Link from "next/link"

const SignupPage: NextPage = () => {
	return (
		<Fragment>
			<div className="flex shrink-0 flex-col w-full min-h-screen items-center justify-center">
				<div className="w-full max-w-[400px]">

					<h1 className="text-2xl font-[700]">Signup</h1>
					<div className="mb-5" />

					<SignupForm />

					<p className="mt-10">
						Or
						<Link href="/authentication/signin" className="text-sky-500 ml-[5px] mr-[5px]">signin</Link>
						if you already have an account
					</p>
				</div>
			</div>
		</Fragment>
	)
}
export default SignupPage
