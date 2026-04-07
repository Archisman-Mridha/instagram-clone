"use server"

import { Cookie } from "@instagram-clone/frontend/lib/cookies"
import { SigninDocument } from "@instagram-clone/frontend/lib/graphql/generated/graphql"
import { getClient } from "@instagram-clone/frontend/lib/graphql/server-side-client"
import { actionClient } from "@instagram-clone/frontend/lib/safe-action"
import { signinArgsValidator } from "@instagram-clone/lib/validators/validators"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const signinAction = actionClient
  .inputSchema(signinArgsValidator)
  .action(async ({ parsedInput }) => {
    const { data, error } = await getClient().query({
      query: SigninDocument,
      variables: { args: parsedInput }
    })

    if (error || !data) throw new Error("unhandled")

    // Store the user id and access token in cookies.

    const {
      signin: { userID, accessToken }
    } = data

    const cookieStore = await cookies()

    cookieStore.set(Cookie.USER_ID, userID, {
      httpOnly: true,
      path: "/"
    })
    cookieStore.set(Cookie.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      path: "/"
    })

    redirect("/")
  })
