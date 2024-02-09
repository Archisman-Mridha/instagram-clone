"use client"

import { ProfilePreview } from "@/graphql/__generated__/generated"
import { Input } from "@nextui-org/react"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { searchProfilesHandler } from "./search-profiles.action"
import toast from "react-hot-toast"
import { useCookies } from "react-cookie"
import dynamic from "next/dynamic"
import Link from "next/link"

const AuthenticationGuard = dynamic(() => import("@/components/authentication-guard.component"), { ssr: false })

const SearchProfilesPage: NextPage = () => {
	const [cookies] = useCookies(["jwt"])

	const [searchQuery, setSearchQuery] = useState<string>("")
	const [profilePreviews, setProfilePreviews] = useState<ProfilePreview[]>([])

	const fetchData = async () => {
		const result = await searchProfilesHandler(searchQuery, cookies.jwt)

		if (result.Err) {
			toast(result.Err)
			return
		}

		setProfilePreviews(result.Ok!)
	}

	useEffect(() => {
		if (searchQuery.length > 0) fetchData()
		else setProfilePreviews([])

		return () => { }
	}, [searchQuery])

	return (
		<AuthenticationGuard>
			<div>
				<Input
					placeholder="Search Profiles"
					radius="none"
					className="mb-10"
					value={searchQuery}
					onChange={(event) => setSearchQuery(event.target.value)}
				/>

				<div className="ml-[10px] mr-[10px]">
					{profilePreviews.map((profilePreview) => (
						<Link
							className="
								w-fit p-[10px] rounded-[10px] flex items-center cursor-pointer hover:bg-zinc-200
							"
							href={`/profiles/${profilePreview.id}`}
						>
							<div
								className="
									h-[50px] w-[50px] rounded-full mr-[7.5px] bg-sky-100
								"
							/>
							<div className="mb-[10px]" key={profilePreview.id}>
								<p>{profilePreview.name}</p>
								<p className="text-sm italic">@{profilePreview.username}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</AuthenticationGuard>
	)
}
export default SearchProfilesPage
