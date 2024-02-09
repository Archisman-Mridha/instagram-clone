"use server"

import {
	FollowDocument,
	FollowMutation,
	FollowMutationVariables,
	UnfollowDocument,
	UnfollowMutation,
	UnfollowMutationVariables
} from "@/graphql/__generated__/generated"
import { getApolloClient } from "@/lib/apollo-client"
import { Result, ServerErrorMessage } from "@/lib/utils"
import { GraphQLErrors } from "@apollo/client/errors"

export const changeFollowshipHandler = async (
	// This is the id of the user, whose profile is being viewed.
	followeeId: number,

	// If this is false, that means the user is already being followed, and now, will be unfollowed.
	unfollow: boolean,

	jwt: string
): Promise<Result<null>> => {
	const apolloClient = getApolloClient(jwt)()

	try {
		let errors: GraphQLErrors | undefined

		if (unfollow) {
			const result = await apolloClient.mutate<UnfollowMutation, UnfollowMutationVariables>({
				mutation: UnfollowDocument,
				variables: { followeeId }
			})
			errors = result.errors
		} else {
			errors = (
				await apolloClient.mutate<FollowMutation, FollowMutationVariables>({
					mutation: FollowDocument,
					variables: { followeeId }
				})
			).errors
		}

		console.log(errors)

		if (errors && errors.length > 0) return { Err: errors.join(" | ") }

		return { Ok: null }
	} catch (error) {
		return { Err: ServerErrorMessage }
	}
}
