/*
	NextJS Server Actions -

	Server Actions are asynchronous functions that are executed on the server. They can be used in
	Server and Client Components to handle form submissions and data mutations in Next.js
	applications.
*/

"use server"

import { getApolloClient } from "@/lib/apollo-client"
import { SignupFormSchema } from "./signup-form.component"
import { MutationSignupArgs, SignupDocument, SignupMutation } from "@/graphql/__generated__/generated"
import { Result } from "@/lib/utils"

export async function signupHandler(data: SignupFormSchema): Promise<Result<string>> {
	const apolloClient= getApolloClient( )( )

	try {
		const { data: response, errors }= await apolloClient.mutate<SignupMutation, MutationSignupArgs>({
			mutation: SignupDocument,
			variables: { args: data }
		})

		if(!response)
			return { Err: new Error("No data found in the response")}

		else if(errors && errors.length > 0)
			return { Err: new Error(errors.join(" | "))}

		return { Ok: response.signup.jwt }

	} catch(error) { return { Err: new Error("Server error occurred")}}
}