import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],

	theme: {
		extends: { }
	},
	darkMode: "class"
}
export default config