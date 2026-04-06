/*
  By default, layouts and pages are Server Components, which lets you fetch data and render parts
  of your UI on the server, optionally cache the result, and stream it to the client.

  On the server, NextJS uses React's APIs to orchestrate rendering. The rendering work is split
  into chunks, by individual route segments (layouts and pages).

    (1) Server Components are rendered into a special data format called the React Server Component
        Payload (RSC Payload). The RSC Payload is a compact binary representation of the rendered
        React Server Components tree. It's used by React on the client to update the browser's DOM.

    (2) Client Components and the RSC Payload are used to prerender HTML.

  Then, on the client (on first load):

    (1) HTML is used to immediately show a fast non-interactive preview of the route to the user.

    (2) RSC Payload is used to reconcile the Client and Server Component trees.

    (3) JavaScript is used to hydrate Client Components and make the application interactive.
        Hydration is React's process for attaching event handlers to the DOM, to make the static
        HTML interactive.

        Hydration is React's process for attaching event handlers to the DOM, to make the static
        HTML interactive.

  On subsequent navigations, the RSC Payload is prefetched and cached for instant navigation.
  Client Components are rendered entirely on the client, without the server-rendered HTML.
*/

// To prevent accidentanl import of server-only code in client components.
import "server-only"
import "./global.css"
import { Metadata } from "next"
import { ContextProviders } from "./_components/context-providers/component"

export const metadata: Metadata = {
  title: "Instagram Clone",
  description: "An Instagram clone, demonstrating distributed systems"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ContextProviders>{children}</ContextProviders>
      </body>
    </html>
  )
}
