import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc"

/*
	Using Apollo Client on server side vs client side -

	Thanks to Apollo Client’s normalized cache, Client Components can automatically update all usages
	of an entity in your application, for example as a result of a mutation. This is not the case for
	Server Components and they must be manually refreshed when data changes.

	So if the same data would be displayed or used in both environments, it would quickly run out of
	sync and result in inconsistencies.

	To keep things consistent, we suggest deciding whether to render each entity in RSC or in Client
	Components. (Entities refer to normalized data objects that are stored in the client cache.)
*/
// We have decided to always use Apollo client on the server side.

export const getApolloClient = (jwt?: string) => {
	return registerApolloClient(() => {
		return new ApolloClient({
			ssrMode: true,

			/*
				Apollo Client stores the results of your GraphQL queries in a local, normalized, in-memory
				cache.
	
				DATA NORMALIZATION - Whenever the Apollo Client cache receives query response data, it does
				the following:
				|
				|- Identify objects - Identify objects in the query response.
				|
				|- Generate cache IDs - The cache generates a cache ID for each of those objects.
				|
				|- Replace object fields with references - Next, the cache takes each field that contains an
				|	 object and replaces its value with the object id.
				|
				|- Store normalized objects - The resulting objects are stored in the cache's flat lookup table.
	
				Since NextJS patches all the fetch requests, this means that requests done with Apollo Client
				are also affected. It doesn’t matter whether requests are GET or POST, NextJS caches all of
				them (at build time).
			*/
			// InMemoryCache stores data as a flat lookup table of objects that can reference each other.
			// These objects correspond to the objects that are returned by your GraphQL queries.
			cache: new InMemoryCache(),

			link: new HttpLink({
				uri: "http://localhost:4000/graphql",
				headers: jwt
					? {
							Authorization: `Bearer ${jwt}`
					  }
					: {}
			}),

			defaultOptions: {
				query: {
					fetchPolicy: "no-cache",
					errorPolicy: "ignore"
				},
				watchQuery: {
					fetchPolicy: "no-cache",
					errorPolicy: "ignore"
				},
				mutate: {
					fetchPolicy: "no-cache",
					errorPolicy: "ignore"
				}
			}
		})
	}).getClient
}
