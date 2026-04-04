import { defineConfig } from "oxlint"

export default defineConfig({
  options: {
    typeAware: true,
    typeCheck: true
  },

  plugins: ["import", "promise", "vitest"]
})
