"use client"

import { Button } from "@base-ui/react/button"
import { useOptimisticAction } from "next-safe-action/hooks"
import { FunctionComponent } from "react"
import { followshipToggleAction } from "./action"

interface FollowshipToggleButtonProps {
  followeeID: number
  isFollowee: boolean
}

export const FollowshipToggleButton: FunctionComponent<FollowshipToggleButtonProps> = ({
  followeeID,
  isFollowee
}) => {
  const { execute, optimisticState, isPending } = useOptimisticAction(followshipToggleAction, {
    currentState: { isFollowee },
    updateFn: (state) => ({ isFollowee: !state.isFollowee })
  })

  return (
    <Button
      disabled={isPending}
      onClick={() => execute({ followeeID, isFollowee: optimisticState.isFollowee })}
    >
      {optimisticState.isFollowee ? "Unfollow" : "Follow"}
    </Button>
  )
}
