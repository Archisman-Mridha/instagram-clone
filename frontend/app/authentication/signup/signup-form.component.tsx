"use client"

import { FormField } from "@/components/form-field.component"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@nextui-org/react"
import { Fragment, FunctionComponent, useEffect } from "react"
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { z } from "zod"
import validator from "validator"
import { signupHandler } from "./signup.action"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useCookies } from "react-cookie"
import { useStore } from "@/store/store"

const signupFormSchema = z.object({
	name: z.string().min(2).max(25),
	email: z.string().email(),

	username: z
		.string()
		.min(4)
		.max(25)
		.refine(usernameRefiner, {
			message: "Username can only contain alphanumeric characters and underscores"
		}),

	password: z.string().min(4).max(25)
})

function usernameRefiner(value: string) {
	for (let character of value)
		if (!validator.isAlphanumeric(character) && character !== "_") return false

	return true
}

export type SignupFormSchema = z.infer<typeof signupFormSchema>

export const SignupForm: FunctionComponent = ({ }) => {
	const router = useRouter()

	const [cookies, setCookies] = useCookies(["jwt"])

	// If the JWT cookie already exists, then the user doesn't need to authenticate and will be
	// redirected to the homepage.
	useEffect(() => {
		if (cookies.jwt)
			router.replace("/")
	}, [cookies])

	const { setUserId } = useStore()

	const submitHandler: SubmitHandler<SignupFormSchema> = async (data: SignupFormSchema) => {
		const { Ok, Err } = await signupHandler(data)

		if (Err) {
			toast(Err)
			return
		}

		const { userId, jwt } = Ok!

		setUserId(userId)
		setCookies("jwt", jwt, { path: "/" })

		router.replace("/")
	}

	const formContext = useForm<SignupFormSchema>({
		mode: "onChange",
		resolver: zodResolver(signupFormSchema),
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
					<FormField name="name" label="Full name" />
					<div className="mb-5" />

					<FormField name="email" type="email" label="Email Address" />
					<div className="mb-5" />

					<FormField name="username" label="Username" />
					<div className="mb-5" />

					<FormField name="password" type="password" label="Password" />
					<div className="mb-5" />
				</FormProvider>
				<Button type="submit" radius="full" isLoading={isSubmitting}>
					Let's Gooo
				</Button>
			</form>
		</Fragment>
	)
}
