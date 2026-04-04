const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin")
const { join } = require("path")

module.exports = {
  output: {
    path: join(__dirname, "../dist/backend"),
    clean: true,
    ...(process.env.NODE_ENV !== "production" && {
      devtoolModuleFilenameTemplate: "[absolute-resource-path]"
    })
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: "node",
      compiler: "swc",
      main: "./src/main.ts",
      tsConfig: "./tsconfig.app.json",
      optimization: true,
      outputHashing: "none",
      generatePackageJson: true
    })
  ]
}
