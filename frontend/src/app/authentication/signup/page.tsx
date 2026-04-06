import Link from "next/link"
import { SignupForm } from "./_components/signup-form/component"

export default function SignupPage() {
  return (
    <div>
      <SignupForm />

      {/*
        Prefetching is the process of loading a route in the background before the user navigates
        to it. This makes navigation between routes in your application feel instant, because by
        the time a user clicks on a link, the data to render the next route is already available
        client side.

        Next.js automatically prefetches routes linked with the <Link> component when they enter
        the user's viewport.

        How much of the route is prefetched depends on whether it's static or dynamic:

          (1) Static Route: the full route is prefetched.

          (2) Dynamic Route: prefetching is skipped, or the route is partially prefetched if
                             loading.tsx is present.

        By skipping or partially prefetching dynamic routes, Next.js avoids unnecessary work on the
        server for routes the users may never visit.
      */}
      <Link href="/authentication/signin">Already have an account? Sign in</Link>
    </div>
  )
}
