"use client"

import { NextPage } from "next"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { getProfileHandler } from "./get-profile.action"
import toast from "react-hot-toast"
import { GetProfileQuery } from "@/graphql/__generated__/generated"
import { changeFollowshipHandler } from "./change-followship.action"
import { Button } from "@nextui-org/react"
import { useStore } from "@/store/store"

interface ProfilePageProps {
	params: {
		id: string
	}
}

const AuthenticationGuard = dynamic(() => import("@/components/authentication-guard.component"), { ssr: false })

const ProfilePage: NextPage<ProfilePageProps> = ({ params: { id } }) => {
	const parsedUserId = parseInt(id)

	const [profileDetails, setProfileDetails] = useState<GetProfileQuery["getProfile"]>(null)

	const [cookies] = useCookies(["jwt"])

	const fetchData = async () => {
		const { Ok, Err } = await getProfileHandler(parsedUserId, cookies.jwt)

		if (Err) {
			toast(Err)
			return
		}

		setProfileDetails(Ok!)
	}

	useEffect(() => {
		fetchData()

		return () => { }
	}, [])

	const [isFollowshipIndicatorButtonLoading, setIsFollowshipIndicatorButtonLoading] = useState<boolean>(false)

	async function changeFollowship() {
		if (isFollowshipIndicatorButtonLoading)
			return

		setIsFollowshipIndicatorButtonLoading(true)

		const unfollow = profileDetails!.isFollowee

		const { Err } = await changeFollowshipHandler(parsedUserId, unfollow, cookies.jwt)

		if (Err) toast(Err)

		else setProfileDetails(previousProfileDetails => previousProfileDetails && ({
			...previousProfileDetails,

			isFollowee: !previousProfileDetails!.isFollowee,
			followerCount: previousProfileDetails.followerCount + (unfollow ? -1 : 1)
		}))

		setIsFollowshipIndicatorButtonLoading(false)
	}

	const { userId: selfId } = useStore()

	if (isNaN(parsedUserId)) return (
		<div className="flex items-center justify-center min-h-screen min-w-screen">Invalid user id</div>
	)

	else return (
		<AuthenticationGuard>
			{profileDetails && (
				<div className="p-[10px]">

					<div className="w-fit rounded-[10px] flex items-center">
						<div
							className="
									h-[50px] w-[50px] rounded-full mr-[7.5px] bg-center bg-cover
									bg-[url('https://static.vecteezy.com/system/resources/previews/007/033/146/original/profile-icon-login-head-icon-vector.jpg')]
								"
						/>
						<div className="mb-[10px]">
							<p>{profileDetails.name}</p>
							<p className="text-sm italic">@{profileDetails.username}</p>
						</div>
					</div>

					<div className="flex">
						<p>
							{profileDetails.followerCount}
							<span className="ml-[2px] text-zinc-500 text-sm">followers</span>
						</p>
						<div className="mr-[20px]" />
						<p>
							{profileDetails.followingCount}
							<span className="ml-[2px] text-zinc-500 text-sm">followings</span>
						</p>
					</div>

					<div className="mb-[5px]" />

					{parsedUserId !== selfId && (
						<Button
							radius="full"
							color={profileDetails.isFollowee ? "default" : "primary"}
							variant={profileDetails.isFollowee ? "bordered" : "solid"}
							onClick={changeFollowship}
							isLoading={isFollowshipIndicatorButtonLoading}
						>
							{profileDetails.isFollowee ? "Unfollow" : "Follow"}
						</Button>
					)}

					<div className="mb-[35px]" />

					{profileDetails.recentPosts.map(post => {
						if (post) return (
							<div className="flex flex-col mb-[20px]">
								<p>{post.description}</p>
								<p className="text-sm italic text-zinc-500">{post.createdAt}</p>
							</div>
						)

						else return null
					})}
				</div>
			)}
		</AuthenticationGuard>
	)
}

export default ProfilePage