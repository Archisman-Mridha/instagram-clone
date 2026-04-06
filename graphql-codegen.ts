import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: "frontend/src/lib/graphql/generated/schema.graphql",
  documents: "frontend/src/lib/graphql/operations/**/*.graphql",
  generates: {
    "frontend/src/lib/graphql/generated/": {
      preset: "client",
      plugins: []
    }
  }
}

export default config
