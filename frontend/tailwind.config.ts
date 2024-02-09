import { nextui } from "@nextui-org/react"
import type { Config } from "tailwindcss"

const config: Config = {
	content: [
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
		"./app/**/*",
		"./components/**/*"
	],

	theme: {
		extends: {}
	},

	darkMode: "class",
	plugins: [nextui()]
}
export default config
