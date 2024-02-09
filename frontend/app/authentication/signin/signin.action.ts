"use server"

import { getApolloClient } from "@/lib/apollo-client"
import { SigninFormSchema } from "./signin-form.component"
import {
	SigninDocument,
	SigninQuery,
	SigninQueryVariables
} from "@/graphql/__generated__/generated"
import { Result, ServerErrorMessage } from "@/lib/utils"

export async function signinHandler(
	data: SigninFormSchema
): Promise<Result<SigninQuery["signin"]>> {
	const apolloClient = getApolloClient()()

	try {
		const { data: response, errors } = await apolloClient.query<SigninQuery, SigninQueryVariables>({
			query: SigninDocument,
			variables: { args: data }
		})

		if (errors && errors.length > 0) return { Err: errors.join(" | ") }
		else if (!response) throw new Error("No data found in the response")

		return { Ok: response.signin }
	} catch (error) {
		return { Err: ServerErrorMessage }
	}
}
