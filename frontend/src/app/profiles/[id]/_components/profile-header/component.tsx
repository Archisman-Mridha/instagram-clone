import "server-only"
import { FollowshipCounts } from "@instagram-clone/frontend/lib/graphql/generated/graphql"
import { FunctionComponent } from "react"
import { FollowshipToggleButton } from "../followship-toggle-button/component"

interface ProfileHeaederProps {
  id: number

  name: string
  username: string
  bio?: string | null | undefined

  followshipCounts: FollowshipCounts

  isFollowee: boolean
}

export const ProfileHeader: FunctionComponent<ProfileHeaederProps> = (props) => {
  return (
    <div>
      <p>{props.name}</p>
      <p>{props.name}</p>
      {props.bio && <p>{props.bio}</p>}

      <div>
        <p>{props.followshipCounts.followerCount} followers</p>
        <p>{props.followshipCounts.followeeCount} followees</p>
      </div>

      <FollowshipToggleButton followeeID={props.id} isFollowee={props.isFollowee} />
    </div>
  )
}
