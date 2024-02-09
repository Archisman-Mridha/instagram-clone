/*
	NextJS Server Actions -

	Server Actions are asynchronous functions that are executed on the server. They can be used in
	Server and Client Components to handle form submissions and data mutations in Next.js
	applications.
*/

"use server"

import { getApolloClient } from "@/lib/apollo-client"
import { SignupFormSchema } from "./signup-form.component"
import {
	SignupDocument,
	SignupMutation,
	SignupMutationVariables
} from "@/graphql/__generated__/generated"
import { Result, ServerErrorMessage } from "@/lib/utils"

export async function signupHandler(
	data: SignupFormSchema
): Promise<Result<SignupMutation["signup"]>> {
	const apolloClient = getApolloClient()()

	try {
		const { data: response, errors } = await apolloClient.mutate<
			SignupMutation,
			SignupMutationVariables
		>({
			mutation: SignupDocument,
			variables: { args: data }
		})

		if (errors && errors.length > 0) return { Err: errors.join(" | ") }
		else if (!response) throw new Error("No data found in the response")

		return { Ok: response.signup }
	} catch (error) {
		return { Err: ServerErrorMessage }
	}
}
