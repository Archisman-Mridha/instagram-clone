"use server"

import { getApolloClient } from "@/lib/apollo-client"
import {
	ProfilePreview,
	SearchProfilesDocument,
	SearchProfilesQuery,
	SearchProfilesQueryVariables
} from "@/graphql/__generated__/generated"
import { Result, ServerErrorMessage } from "@/lib/utils"

export async function searchProfilesHandler(
	searchQuery: string,
	jwt: string
): Promise<Result<ProfilePreview[]>> {
	const apolloClient = getApolloClient(jwt)()

	try {
		const { data: response, errors } = await apolloClient.query<
			SearchProfilesQuery,
			SearchProfilesQueryVariables
		>({
			query: SearchProfilesDocument,
			variables: { args: { query: searchQuery } }
		})

		if (errors && errors.length > 0) return { Err: errors.join(" | ") }
		else if (!response) throw new Error("No data found in the response")

		return { Ok: response.searchProfiles.profilePreviews as ProfilePreview[] }
	} catch (error) {
		return { Err: ServerErrorMessage }
	}
}
