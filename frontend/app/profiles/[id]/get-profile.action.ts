"use server"

import {
	GetProfileDocument,
	GetProfileQuery,
	GetProfileQueryVariables
} from "@/graphql/__generated__/generated"
import { getApolloClient } from "@/lib/apollo-client"
import { Result, ServerErrorMessage } from "@/lib/utils"

export const getProfileHandler = async (
	id: number,
	jwt: string
): Promise<Result<GetProfileQuery["getProfile"]>> => {
	const apolloClient = getApolloClient(jwt)()

	try {
		const { data: response, errors } = await apolloClient.query<
			GetProfileQuery,
			GetProfileQueryVariables
		>({
			query: GetProfileDocument,
			variables: { args: { userId: id } }
		})

		if (errors && errors.length > 0) return { Err: errors.join(" | ") }
		else if (!response) throw new Error("No data found in the response")

		return { Ok: response.getProfile }
	} catch (error) {
		return { Err: ServerErrorMessage }
	}
}
