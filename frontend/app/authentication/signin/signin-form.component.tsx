"use client"

import { FormField } from "@/components/form-field.component"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@nextui-org/react"
import { Fragment, FunctionComponent } from "react"
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { z } from "zod"
import { signinHandler } from "./signin.action"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useCookies } from "react-cookie"

const signinFormSchema= z.object({
	
	identifier: z.string( ),
	password: z.string( ).min(4).max(25)
})

export type SigninFormSchema= z.infer<typeof signinFormSchema>

export const SigninForm: FunctionComponent= ({ }) => {
	const router= useRouter( )

	const [cookies, setCookies]= useCookies( )

	const submitHandler: SubmitHandler<SigninFormSchema> = async (data: SigninFormSchema) => {
		const result= await signinHandler(data)

		if(result.Err) {
			toast(result.Err.message)
			return
		}

		const jwt= result.Ok
		setCookies("jwt", jwt)

		router.replace("/")
	}

	const formContext= useForm<SigninFormSchema>({
		mode: "onChange",
		resolver: zodResolver(signinFormSchema), reValidateMode: "onBlur"
	})

	const { handleSubmit, formState: { isSubmitting }}= formContext

	return (
		<Fragment>
			<form onSubmit={handleSubmit(submitHandler)}>
				<FormProvider {...formContext}>

					<FormField
						name="identifier"
						label="Username / Email Address"
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