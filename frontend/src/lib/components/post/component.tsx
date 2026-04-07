import {
  FragmentType,
  useFragment
} from "@instagram-clone/frontend/lib/graphql/generated/fragment-masking"
import {
  PostFragmentFragmentDoc as PostFragmentDoc,
  ProfilePreviewFragmentFragmentDoc as ProfilePreviewFragmentDoc
} from "@instagram-clone/frontend/lib/graphql/generated/graphql"
import Image from "next/image"
import { FunctionComponent } from "react"

interface PostProps {
  post: FragmentType<typeof PostFragmentDoc>
}

export const Post: FunctionComponent<PostProps> = ({ post: postFragment }) => {
  const post = useFragment(PostFragmentDoc, postFragment)
  const author = useFragment(ProfilePreviewFragmentDoc, post.authorProfilePreview)

  return (
    <div>
      <div>
        <p>{author.name}</p>
        <p>@{author.username}</p>
      </div>

      <div>
        <Image src={post.imageURL} alt="" fill />
      </div>

      {post.description && <p>{post.description}</p>}
    </div>
  )
}
