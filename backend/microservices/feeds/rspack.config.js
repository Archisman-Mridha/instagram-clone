const { NxAppRspackPlugin } = require("@nx/rspack/app-plugin")
const { join } = require("path")

module.exports = {
  output: {
    path: join(__dirname, "../../../dist/backend/microservices/feeds"),
    clean: true,
    ...(process.env.NODE_ENV !== "production" && {
      devtoolModuleFilenameTemplate: "[absolute-resource-path]"
    })
  },
  plugins: [
    new NxAppRspackPlugin({
      target: "node",
      compiler: "swc",
      main: join(__dirname, "src/main.ts"),
      tsConfig: join(__dirname, "tsconfig.app.json"),
      optimization: true,
      outputHashing: "none",
      generatePackageJson: true,
      sourceMap: true
    })
  ]
}
