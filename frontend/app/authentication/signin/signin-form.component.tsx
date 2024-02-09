"use client"

import { FormField } from "@/components/form-field.component"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@nextui-org/react"
import { Fragment, FunctionComponent, useEffect } from "react"
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { z } from "zod"
import { signinHandler } from "./signin.action"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useCookies } from "react-cookie"
import { useStore } from "@/store/store"

const signinFormSchema = z.object({
	identifier: z.string(),
	password: z.string().min(4).max(25)
})

export type SigninFormSchema = z.infer<typeof signinFormSchema>

export const SigninForm: FunctionComponent = ({ }) => {
	const router = useRouter()

	const [cookies, setCookies] = useCookies(["jwt"])

	// If the JWT cookie already exists, then the user doesn't need to authenticate and will be
	// redirected to the homepage.
	useEffect(() => {
		if (cookies.jwt)
			router.replace("/")
	}, [cookies])

	const { setUserId } = useStore()

	const submitHandler: SubmitHandler<SigninFormSchema> = async (data: SigninFormSchema) => {
		const { Ok, Err } = await signinHandler(data)

		if (Err) {
			toast(Err)
			return
		}

		const { userId, jwt } = Ok!

		setUserId(userId)
		setCookies("jwt", jwt, { path: "/" })

		router.replace("/")
	}

	const formContext = useForm<SigninFormSchema>({
		mode: "onChange",
		resolver: zodResolver(signinFormSchema),
		reValidateMode: "onBlur"
	})

	const {
		handleSubmit,
		formState: { isSubmitting }
	} = formContext

	return (
		<Fragment>
			<form onSubmit={handleSubmit(submitHandler)}>
				<FormProvider {...formContext}>
					<FormField name="identifier" label="Username / Email Address" />
					<div className="mb-5" />

					<FormField name="password" type="password" label="Password" />
					<div className="mb-5" />
				</FormProvider>
				<Button type="submit" isLoading={isSubmitting}>
					Let's Gooo
				</Button>
			</form>
		</Fragment>
	)
}
