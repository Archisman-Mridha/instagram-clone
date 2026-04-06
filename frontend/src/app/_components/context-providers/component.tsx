"use client"

import { ApolloNextAppProvider } from "@apollo/client-integration-nextjs"
import { Toast } from "@base-ui/react/toast"
import { createApolloClient } from "@instagram-clone/frontend/lib/graphql/base-client"
import { FunctionComponent, PropsWithChildren } from "react"

export const ContextProviders: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <ApolloNextAppProvider makeClient={createApolloClient}>
      <Toast.Provider>{children}</Toast.Provider>
    </ApolloNextAppProvider>
  )
}
