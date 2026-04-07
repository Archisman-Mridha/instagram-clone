import "server-only"
import {
  FollowDocument,
  UnfollowDocument
} from "@instagram-clone/frontend/lib/graphql/generated/graphql"
import { getClient } from "@instagram-clone/frontend/lib/graphql/server-side-client"
import { actionClient } from "@instagram-clone/frontend/lib/safe-action"
import { z } from "zod"

const followshipToggleSchema = z.object({
  followeeID: z.number().int(),
  isFollowee: z.boolean()
})

export const followshipToggleAction = actionClient
  .inputSchema(followshipToggleSchema)
  .action(async ({ parsedInput: { followeeID, isFollowee } }) => {
    const { error } = await getClient().mutate({
      mutation: isFollowee ? UnfollowDocument : FollowDocument,
      variables: { args: { followeeID } }
    })

    if (error) throw new Error("unhandled")
  })
