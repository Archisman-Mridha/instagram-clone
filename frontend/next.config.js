/** @type {import('next').NextConfig} */
const nextConfig = {
	/*
		Since Server Actions can be invoked in a <form> element, this opens them up to CSRF attacks.
		Behind the scenes, Server Actions use the POST method, and only this HTTP method is allowed to
		invoke them. This prevents most CSRF vulnerabilities in modern browsers, particularly with
		SameSite cookies being the default.
		As an additional protection, Server Actions in NextJS also compare the Origin header to the Host
		header (or X-Forwarded-Host). If these don't match, the request will be aborted. In other words,
		Server Actions can only be invoked on the same host as the page that hosts it.
	*/

	/*
		During a build, Next.js will automatically trace each page and its dependencies to determine all
		of the files that are needed for deploying a production version of your application.

		During next build, Next.js will use @vercel/nft to statically analyze import, require, and fs
		usage to determine all files that a page might load.

		This will create a folder at .next/standalone which can then be deployed on its own without
		installing node_modules. Additionally, a minimal server.js file is also output which can be used
		instead of next start. This minimal server does not copy the public or .next/static folders by
		default as these should ideally be handled by a CDN instead, although these folders can be
		copied to the standalone/public and standalone/.next/static folders manually, after which
		server.js file will serve these automatically.
	*/
	output: "standalone"
}

module.exports = nextConfig
