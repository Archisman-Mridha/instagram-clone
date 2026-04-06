"use server"

import { Cookie } from "@instagram-clone/frontend/lib/cookies"
import { CreateUserDocument } from "@instagram-clone/frontend/lib/graphql/generated/graphql"
import { getClient } from "@instagram-clone/frontend/lib/graphql/server-side-client"
import { actionClient } from "@instagram-clone/frontend/lib/safe-action"
import { createUserArgsValidator } from "@instagram-clone/lib/validators/validators"
import { UnrecognizedActionError } from "next/dist/client/components/unrecognized-action-error"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const signupAction = actionClient
  .inputSchema(createUserArgsValidator)
  .action(async ({ parsedInput }) => {
    const { data, error } = await getClient().mutate({
      mutation: CreateUserDocument,
      variables: { args: parsedInput }
    })

    if(error || !data)
      throw new UnrecognizedActionError

    // Store the user id and access token in cookies.

    const { createUser: { userID, accessToken } } = data

    const cookieStore = await cookies()

    cookieStore.set(Cookie.USER_ID, userID, {
      httpOnly: true,
      path: "/"
    })
    cookieStore.set(Cookie.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      path: "/"
    })

    // Send the user to his / her feed.
    redirect("/")
  })
