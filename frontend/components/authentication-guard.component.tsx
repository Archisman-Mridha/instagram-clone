"use client"

import { useRouter } from "next/navigation"
import { Fragment, FunctionComponent, PropsWithChildren, useEffect } from "react"
import { useCookies } from "react-cookie"

export const AuthenticationGuard: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const router= useRouter( )

	const [cookies]= useCookies( )

	useEffect(( ) => {
		if(!cookies.jwt)
			router.replace("/authentication/signin")
	}, [ ])

	if(!cookies.jwt)
		return <Fragment></Fragment>

	else return children
}