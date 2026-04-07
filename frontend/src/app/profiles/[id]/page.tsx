import "server-only"
import { GetProfileByIdDocument } from "@instagram-clone/frontend/lib/graphql/generated/graphql"
import { getClient } from "@instagram-clone/frontend/lib/graphql/server-side-client"
import { ProfileHeader } from "./_components/profile-header/component"

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data, error } = await getClient().query({
    query: GetProfileByIdDocument,
    variables: { args: { id: parseInt(id) } }
  })

  if (error || !data) throw new Error("unhandled")

  const { getProfileByID: profile } = data

  return (
    <div>
      <ProfileHeader {...profile} id={parseInt(profile.id)} />
    </div>
  )
}
