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
}

module.exports = nextConfig
