/*
  The special file loading.js helps you create meaningful Loading UI with React Suspense. With
  this convention, you can show an instant loading state from the server while the content of a
  route segment loads. The new content is automatically swapped in once rendering is complete.

  It will automatically wrap the page.tsx file and any children below in a Suspense boundary.

  The App Router supports streaming with Suspense. Streaming allows you to break down the page's
  HTML into smaller chunks and progressively send those chunks from the server to the client. This
  enables parts of the page to be displayed sooner, without waiting for all the data to load before
  any UI can be rendered.
*/

export default function Loading() {
  return null
}
