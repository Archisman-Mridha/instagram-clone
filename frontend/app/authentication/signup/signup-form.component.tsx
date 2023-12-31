"use client"

import { FormField } from "@/components/form-field.component"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@nextui-org/react"
import { Fragment, FunctionComponent } from "react"
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { z } from "zod"
import validator from "validator"
import { signupHandler } from "./signup.action"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useCookies } from "react-cookie"

const signupFormSchema= z.object({
	
	name: z.string( ).min(2).max(25),
	email: z.string( ).email( ),

	username: z.string( ).min(4).max(25)
						 .refine(usernameRefiner, { message: "Username can only contain alphanumeric characters and underscores" }),

	password: z.string( ).min(4).max(25)
})

function usernameRefiner(value: string) {
	for(let character of value)
		if(!validator.isAlphanumeric(character) && character !== "_")
			return false

	return true
}

export type SignupFormSchema= z.infer<typeof signupFormSchema>

export const SignupForm: FunctionComponent= ({ }) => {
	const router= useRouter( )

	const [cookies, setCookies]= useCookies( )

	const submitHandler: SubmitHandler<SignupFormSchema> = async (data: SignupFormSchema) => {
		const result= await signupHandler(data)

		if(result.Err) {
			toast(result.Err.message)
			return
		}

		const jwt= result.Ok
		setCookies("jwt", jwt)

		router.replace("/")
	}

	const formContext= useForm<SignupFormSchema>({
		mode: "onChange",
		resolver: zodResolver(signupFormSchema), reValidateMode: "onBlur"
	})

	const { handleSubmit, formState: { isSubmitting }}= formContext

	return (
		<Fragment>
			<form onSubmit={handleSubmit(submitHandler)}>
				<FormProvider {...formContext}>

					<FormField
						name="name"
						label="Full name"
					/>

					<FormField
						name="email"
						type="email"
						label="Email Address"
					/>

					<FormField
						name="username"
						label="Username"
					/>

					<FormField
						name="password"
						type="password"
						label="Password"
					/>
				</FormProvider>
				<Button type="submit" isLoading={isSubmitting}>Let's Gooo</Button>
			</form>
		</Fragment>
	)
}