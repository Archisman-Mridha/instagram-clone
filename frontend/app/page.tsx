"use client"

import { NextPage } from "next"
import { useState } from "react"
import { useCookies } from "react-cookie"
import { getFeedHandler } from "./get-feed.action"
import { GetFeedQuery } from "@/graphql/__generated__/generated"
import toast from "react-hot-toast"
import dynamic from "next/dynamic"
import InfiniteScroll from "react-infinite-scroll-component"
import Link from "next/link"

const AuthenticationGuard = dynamic(() => import("@/components/authentication-guard.component"), { ssr: false })

const Home: NextPage = () => {
	const [feed, setFeed] = useState<GetFeedQuery["getFeed"]>([])
	const [oldestFeedPostFetched, setOldestFeedPostFetched] = useState<boolean>(false)

	const [cookies] = useCookies(["jwt"])

	async function fetchData() {
		if (oldestFeedPostFetched)
			return

		const { Ok, Err } = await getFeedHandler(feed.length, cookies.jwt)

		if (Err) {
			toast(Err)
			return
		}

		else if (Ok!.length === 0) {
			setOldestFeedPostFetched(true)
			return
		}

		setFeed(existingPosts => [
			...existingPosts,
			...Ok!
		])
	}

	return (
		<AuthenticationGuard>
			<div className="p-[10px]">
				<div className="w-full flex justify-end mb-[15px]">
					<Link href="/profiles/search" className="text-sm text-sky-500">Search Profiles</Link>
				</div>

				<InfiniteScroll
					dataLength={feed.length}
					next={fetchData}
					hasMore={!oldestFeedPostFetched}
					loader={<p>Loading more posts...</p>}
				>
					<div>
						{feed.map(post => {
							if (post) return (
								<div key={post.id} className="mb-[35px]">
									<p className="text-sm font-bold">
										Posted by user with id
										<Link href={`/profiles/${post.ownerId}`} className="ml-[5px] cursor-pointer text-sky-500">{post.ownerId}</Link>
									</p>
									<p>{post.description}</p>
									<p className="text-sm italic text-zinc-500">{post.createdAt}</p>
								</div>
							)

							return null
						})}
					</div>
				</InfiniteScroll>
			</div>
		</AuthenticationGuard>
	)
}
export default Home
