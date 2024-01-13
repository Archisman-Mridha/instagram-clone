import type { Metadata, ServerRuntime } from "next"
import { FunctionComponent, PropsWithChildren } from "react"
import { Providers } from "./providers.component"

/*
	NextJS Runtimes -

	Runtime refers to the set of libraries, APIs, and general functionality available to your code
	during execution.
	There are 2 different runtimes available : NodeJS (default) and Edge.

	The Edge runtime is a subset of available NodeJS APIs. It  is ideal if you need to deliver
	dynamic, personalized content at low latency with small, simple functions.
*/
export const runtime: ServerRuntime = "edge"

export const metadata: Metadata = {
	title: "Instagram Clone"
}

const RootLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
export default RootLayout
