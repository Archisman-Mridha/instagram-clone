/*
  React Server Components :

    When you want to use Apollo Client in your Next.js app with React Server Components, you will
    need a way of creating a client instance that is shared between all your server components for
    one request to prevent making duplicate requests.

  React Client Components :

    When using the app directory, all your "client components" will not only run in the browser.
    They will also be rendered on the server - in an "SSR" run that will execute after React Server
    Components have been rendered.

    When you want to make the most of your application, you probably already want to make your
    GraphQL requests on the server so that the page is fully rendered when it reaches the browser.

    This package provides the tools necessary to execute your GraphQL queries on the server and to
    use the results to hydrate your browser-side cache and components.

  NOTE : We do handle "RSC" and "SSR" use cases as completely separate.
        
         You should generally try not to have overlapping queries between the two, as all queries
         made in SSR can dynamically update in the browser as the cache updates (e.g. from a
         mutation or another query), but queries made in RSC will not be updated in the browser -
         for that purpose, the full page would need to rerender. As a result, any overlapping data
         would result in inconsistencies in your UI.

         So decide for yourself, which queries you want to make in RSC and which in SSR, and don't
         have them overlap.
*/

import { HttpLink, setLogVerbosity } from "@apollo/client"
import { ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs"

export const ACCESS_TOKEN_LOCAL_STORAGE_KEY = "access-token"

export const createApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),

    link: new HttpLink({
      uri: process.env.GRAPHQL_SERVER_URL,

      // Tell the network interface to send the cookie along with every request, for
      // authentication.
      credentials: "include"
    })
  })

if (process.env.NODE_ENV === "development") setLogVerbosity("debug")
