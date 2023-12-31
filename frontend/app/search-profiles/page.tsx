"use client"

import { ProfilePreview } from "@/graphql/__generated__/generated"
import { Input } from "@nextui-org/react"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { searchProfilesHandler } from "./search-profiles.action"
import toast from "react-hot-toast"
import { useCookies } from "react-cookie"
import { AuthenticationGuard } from "@/components/authentication-guard.component"

const SearchProfiles: NextPage= ( ) => {
	const [cookies]= useCookies( );

	const [searchQuery, setSearchQuery]= useState<string>("")
	const [profilePreviews, setProfilePreviews]= useState<ProfilePreview[]>([ ])

	useEffect(( ) => {
		const fetchData= async ( ) => {
			const result= await searchProfilesHandler(searchQuery, cookies.jwt)

			if(result.Err) {
				toast(result.Err.message)
				return
			}

			setProfilePreviews(result.Ok!)
		}

		if(searchQuery.length > 0)
			fetchData( )

		else setProfilePreviews([ ])

		return ( ) => { }
	}, [ searchQuery ])

	return (
		<AuthenticationGuard>
			<Input
				value={searchQuery}
				onChange={event => setSearchQuery(event.target.value)}
			/>

			{
				profilePreviews.map(profilePreview => (
					<div key={profilePreview.id}>
						<p>{ profilePreview.name }</p>
						<p>{ profilePreview.username }</p>
					</div>
				))
			}
		</AuthenticationGuard>
	)
}
export default SearchProfiles