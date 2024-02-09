"use server"

import { getApolloClient } from "@/lib/apollo-client"
import {
	GetFeedDocument,
	GetFeedQuery,
	GetFeedQueryVariables
} from "@/graphql/__generated__/generated"
import { Result, ServerErrorMessage } from "@/lib/utils"

export async function getFeedHandler(
	offset: number,
	jwt: string
): Promise<Result<GetFeedQuery["getFeed"]>> {
	const apolloClient = getApolloClient(jwt)()

	try {
		const { data: response, errors } = await apolloClient.query<
			GetFeedQuery,
			GetFeedQueryVariables
		>({
			query: GetFeedDocument,
			variables: { args: { offset, pageSize: 20 } }
		})

		if (errors && errors.length > 0) return { Err: errors.join(" | ") }
		else if (!response) throw new Error("No data found in the response")

		return { Ok: response.getFeed }
	} catch (error) {
		return { Err: ServerErrorMessage }
	}
}
