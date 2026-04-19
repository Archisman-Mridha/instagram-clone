const { NxAppRspackPlugin } = require("@nx/rspack/app-plugin")
const { join } = require("path")

module.exports = {
  output: {
    path: join(__dirname, "../../../dist/backend/microservices/profiles"),
    clean: true,
    ...(process.env.NODE_ENV !== "production" && {
      devtoolModuleFilenameTemplate: "[absolute-resource-path]"
    })
  },
  plugins: [
    new NxAppRspackPlugin({
      target: "node",
      compiler: "swc",
      main: "./src/main.ts",
      tsConfig: "./tsconfig.app.json",
      optimization: true,
      outputHashing: "none",
      generatePackageJson: true,
      sourceMap: true
    })
  ]
}
