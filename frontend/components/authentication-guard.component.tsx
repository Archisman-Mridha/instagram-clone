"use client"

import { useRouter } from "next/navigation"
import { FunctionComponent, PropsWithChildren, useEffect } from "react"
import { useCookies } from "react-cookie"

export const AuthenticationGuard: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const router = useRouter()

	const [cookies] = useCookies(["jwt"])

	useEffect(() => {
		if (!cookies.jwt) router.replace("/authentication/signin")
	}, [cookies])

	return children
}
export default AuthenticationGuard