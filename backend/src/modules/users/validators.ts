import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from "class-validator"
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "./entity"

@ValidatorConstraint({ name: "isValidUsername" })
export class UsernameValidator implements ValidatorConstraintInterface {
  private message: string

  validate(username: string): boolean {
    if (typeof username !== "string") return false

    if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
      this.message = "username length must be between 3-30 characters"
      return false
    }

    let hasLetter: boolean = false

    for (const character of username) {
      switch (true) {
        case isAlphabetic(character):
          hasLetter = true
          break

        case isNumber(character) || character == "_":
          break

        default:
          this.message = "username can only contain alphanumeric and underscores characters"
          return false
      }
    }

    if (!hasLetter) {
      this.message = "username must contain atleast one letter"
      return false
    }

    return true
  }

  defaultMessage(_args: ValidationArguments): string {
    return this.message
  }
}

function isAlphabetic(character: string) {
  return (character >= "a" && character <= "z") || (character >= "A" && character <= "Z")
}

function isNumber(character: string) {
  return character >= "0" && character <= "9"
}
