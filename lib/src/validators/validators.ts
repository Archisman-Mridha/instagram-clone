import { z } from "zod"

export const NAME_MIN_LENGTH = 3,
  NAME_MAX_LENGTH = 30

const nameValidator = z.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH)

export const USERNAME_MIN_LENGTH = 3,
  USERNAME_MAX_LENGTH = 30

export const usernameValidator = z
  .string()
  .min(USERNAME_MIN_LENGTH)
  .max(USERNAME_MAX_LENGTH)
  .superRefine((username, context) => {
    let hasLetter = false

    for (const character of username) {
      if (isAlphabetic(character)) {
        hasLetter = true

        continue
      }

      if (!(isNumber(character) || character === "_" || character === "."))
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "username can only contain alphanumeric characters, underscores and dots"
        })
    }

    if (!hasLetter)
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "username must contain atleast one letter"
      })
  })

const PASSWORD_MIN_LENGTH = 8,
  PASSWORD_MAX_LENGTH = 30

const passwordValidator = z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH)

export const POST_DESCRIPTION_MAX_LENGTH = 100

const postDescriptionValidator = z.string().max(POST_DESCRIPTION_MAX_LENGTH)

export const createUserArgsValidator = z.object({
  name: nameValidator,
  username: usernameValidator,
  email: z.email(),
  password: passwordValidator
})

export type CreateUserArgsSchema = z.infer<typeof createUserArgsValidator>

export const signinArgsValidator = z.object({
  email: z.email(),
  password: passwordValidator
})

export type SigninArgsSchema = z.infer<typeof signinArgsValidator>

export const createPostValidator = z.object({
  description: postDescriptionValidator,
  imageURL: z.url()
})

export type CreatePostSchema = z.infer<typeof createPostValidator>

function isAlphabetic(character: string) {
  return (character >= "a" && character <= "z") || (character >= "A" && character <= "Z")
}

function isNumber(character: string) {
  return character >= "0" && character <= "9"
}
