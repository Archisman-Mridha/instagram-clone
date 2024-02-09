"use client"

import "./globals.css"
import { Fragment, FunctionComponent, PropsWithChildren } from "react"
import { NextUIProvider } from "@nextui-org/react"
import { Poppins } from "next/font/google"
import { Toaster } from "react-hot-toast"

const poppins = Poppins({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"]
})

export const Providers: FunctionComponent<PropsWithChildren> = ({ children }) => {
	return (
		<Fragment>
			<NextUIProvider>
				<main className={poppins.className}>
					{children}

					<Toaster position="bottom-right" />
				</main>
			</NextUIProvider>
		</Fragment>
	)
}
