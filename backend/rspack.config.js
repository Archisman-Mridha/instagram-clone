const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin")
const { join } = require("path")

module.exports = {
  resolve: {
    modules: [__dirname, "node_modules"]
  },
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
      main: join(__dirname, "src/main.ts"),
      tsConfig: join(__dirname, "tsconfig.app.json"),
      optimization: true,
      outputHashing: "none",
      generatePackageJson: true
    })
  ]
}
