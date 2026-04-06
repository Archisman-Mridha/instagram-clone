import Link from "next/link"
import { SigninForm } from "./_components/signin-form/component"

export default function SigninPage() {
  return (
    <div>
      <SigninForm />

      <Link href="/authentication/signup">Don't have an account? Sign up</Link>
    </div>
  )
}
