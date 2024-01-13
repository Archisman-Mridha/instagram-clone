"use server"

import { getApolloClient } from "@/lib/apollo-client"
import {
	ProfilePreview,
	QuerySearchProfilesArgs,
	SearchProfilesDocument,
	SearchProfilesQuery
} from "@/graphql/__generated__/generated"
import { Result } from "@/lib/utils"

export async function searchProfilesHandler(
	searchQuery: string,
	jwt: string
): Promise<Result<ProfilePreview[]>> {
	const apolloClient = getApolloClient(jwt)()

	try {
		const { data: response, errors } = await apolloClient.query<
			SearchProfilesQuery,
			QuerySearchProfilesArgs
		>({
			query: SearchProfilesDocument,
			variables: { args: { query: searchQuery } }
		})

		if (!response) return { Err: new Error("No data found in the response") }
		else if (errors && errors.length > 0) return { Err: new Error(errors.join(" | ")) }

		return { Ok: response.searchProfiles.profilePreviews as ProfilePreview[] }
	} catch (error) {
		return { Err: new Error("Server error occurred") }
	}
}
