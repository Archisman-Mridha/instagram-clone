import "server-only"
import { registerApolloClient } from "@apollo/client-integration-nextjs"
import { createApolloClient } from "./base-client"

// Create and register the Apollo client to be used by RSCs.
export const { getClient } = registerApolloClient(createApolloClient)
