import { CombinedGraphQLErrors } from "@apollo/client"
import { query } from "frontend/src/graphql/client"
import { PingDocument } from "frontend/src/graphql/generated/graphql"

export default async function PingPage() {
  const { data, error } = await query({ query: PingDocument })

  if (CombinedGraphQLErrors.is(error))
    console.error(
      "Error returned from GraphQL server : ",
      ...error.errors.map((error) => error.message)
    )
  else if (error) console.error("Network error : ", error.message)

  return null
}
