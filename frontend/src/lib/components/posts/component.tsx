"use client"

import {
  FragmentType,
  useFragment
} from "@instagram-clone/frontend/lib/graphql/generated/fragment-masking"
import { PostFragmentFragmentDoc as PostFragmentDoc } from "@instagram-clone/frontend/lib/graphql/generated/graphql"
import { FunctionComponent, useEffect, useRef, useState, useTransition } from "react"
import { Post } from "../post/component"

interface PostsProps {
  initialPosts: FragmentType<typeof PostFragmentDoc>[]
  totalCount: number
  fetchMore: (skip: number) => Promise<FragmentType<typeof PostFragmentDoc>[]>
}

export const Posts: FunctionComponent<PostsProps> = ({ initialPosts, totalCount, fetchMore }) => {
  const [postFragments, setPostFragments] = useState(initialPosts)
  const [isPending, startTransition] = useTransition()
  const sentinelRef = useRef<HTMLDivElement>(null)

  const posts = useFragment(PostFragmentDoc, postFragments)
  const hasMore = postFragments.length < totalCount

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || isPending) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        startTransition(async () => {
          const newPosts = await fetchMore(postFragments.length)
          setPostFragments((prev) => [...prev, ...newPosts])
        })
      },
      { rootMargin: "200px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isPending, postFragments.length])

  return (
    <div className="overflow-y-auto">
      {postFragments.map((postFragment, i) => (
        <Post key={posts[i].id} post={postFragment} />
      ))}

      {hasMore && <div ref={sentinelRef} />}
      {isPending && <p>Loading...</p>}
    </div>
  )
}
