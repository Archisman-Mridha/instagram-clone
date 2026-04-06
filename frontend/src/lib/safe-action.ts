import { createSafeActionClient } from "next-safe-action"

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    console.error(error)
    return "An unexpected error occurred. Please try again."
  }
})
