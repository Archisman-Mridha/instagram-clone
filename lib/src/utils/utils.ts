export const isDevelopmentEnvironment = process.env["NODE_ENV"] === "development"

export const isAlphabetic = (character: string) =>
  (character >= "a" && character <= "z") || (character >= "A" && character <= "Z")

export const isNumber = (character: string) => character >= "0" && character <= "9"
