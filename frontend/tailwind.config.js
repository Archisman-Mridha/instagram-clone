// const { createGlobPatternsForDependencies } = require("@nx/next/tailwind")

// The above utility import will not work if you are using Next.js' --turbo.
// Instead you will have to manually add the dependent paths to be included.
//
// A discussion of the issue can be found: https://github.com/nrwl/nx/issues/26510

/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}",
    "!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}"
    //     ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
