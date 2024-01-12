// NextJS is a React framework for building full-stack web applications. You use React Components to
// build user interfaces, and NextJS for additional features and optimizations.

// Under the hood, NextJS also abstracts and automatically configures tooling needed for React, like
// bundling, compiling, and more.

/*
	REACT SERVER COMPONENTS (used by default) -

	React Server Components allow you to write UI that can be rendered and optionally cached on the
	server. In Next.js, the rendering work is further split by route segments to enable streaming and
	partial rendering, and there are three different server rendering strategies:
	|
  |- STATIC RENDERING - Routes are rendered at build time, or in the background after data
	|	 revalidation. The result is cached and can be pushed to a CDN. It is useful when a route has
	|	 data that is not personalized to the user and can be known at build time, such as a static blog
	|	 post or a product page.
	|
	|- DYNAMIC RENDERING - Routes are rendered for each user at request time. It is useful when a
	|  route has data that is personalized to the user or has information that can only be known at
	|  request time, such as cookies or the URL's search params.
	|
	|	 NOTE - you can have dynamically rendered routes that have both cached and uncached data. This
	|  is because the RSC Payload and data are cached separately. This allows you to opt into dynamic
	|	 rendering without worrying about the performance impact of fetching all the data at requesttime.
	|
	|- STREAMING - Streaming enables you to progressively render UI from the server. Work is split
	   into chunks and streamed to the client as it becomes ready. This allows the user to see parts
		 of the page immediately, before the entire content has finished rendering.
		 Streaming is built into the Next.js App Router by default.

	HOW ARE RSCs RENDERED -

	1.React renders Server Components into a special data format called the React Server Component
		Payload (RSC Payload). NextJS uses the RSC Payload and Client Component JavaScript instructions
		to render HTML on the server.

	2.Then on the client side, the HTML is used to immediately show a fast non-interactive preview of
		the route (this is for the initial page load only). The RSC payload is used to reconcile the
		Client and Server Component trees, and update the DOM. Finally, the JavaScript instructions are
		used to hydrate Client Components and make the application interactive.

		NOTE - Hydration is the process of attaching event listeners to the DOM, to make the static HTML
		interactive.

	The RSC Payload is a compact binary representation of the rendered React Server Components tree.
	It's used by React on the client to update the browser's DOM. The RSC Payload contains:
	|
	|- The rendered result of Server Components
	|
	|- Placeholders for where Client Components should be rendered and references to their JavaScript
	|  files.
	|
	|- Any props passed from a Server Component to a Client Component

	Benefits of Server Side Rendering - https://nextjs.org/docs/app/building-your-application/rendering/server-components#benefits-of-server-rendering
*/

/*
	CLIENT COMPONENTS -

	In Next.js, Client Components are rendered differently depending on whether the request is part of
	a full page load (an initial visit to your application or a page reload triggered by a browser
	refresh) or a subsequent navigation.
	|
	|- FULL PAGE LOAD - The rendering procedure is similar to RSCs.
	|
	|- SUBSEQUENT NAVIGATIONS - client components are rendered entirely on the client, without the
	|	 server-rendered HTML. This means the client component JavaScript bundle is downloaded and
	|  parsed. Once the bundle is ready, React will use the RSC Payload to reconcile the Client and
	|  Server Component trees, and update the DOM.
*/

// Composition patterns - https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns.
