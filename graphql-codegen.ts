import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: "frontend/src/graphql/generated/schema.graphql",
  documents: "frontend/src/graphql/operations/**/*.graphql",
  generates: {
    "frontend/src/graphql/generated/": {
      preset: "client",
      plugins: []
    }
  }
}

export default config
