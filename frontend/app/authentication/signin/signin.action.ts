"use server"

import { getApolloClient } from "@/lib/apollo-client"
import { SigninFormSchema } from "./signin-form.component"
import { QuerySigninArgs, SigninDocument, SigninQuery } from "@/graphql/__generated__/generated"
import { Result } from "@/lib/utils"

export async function signinHandler(data: SigninFormSchema): Promise<Result<string>> {
	const apolloClient = getApolloClient()()

	try {
		const { data: response, errors } = await apolloClient.query<SigninQuery, QuerySigninArgs>({
			query: SigninDocument,
			variables: { args: data }
		})

		if (!response) return { Err: new Error("No data found in the response") }
		else if (errors && errors.length > 0) return { Err: new Error(errors.join(" | ")) }

		return { Ok: response.signin.jwt }
	} catch (error) {
		return { Err: new Error("Server error occurred") }
	}
}
