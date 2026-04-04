import { RunScriptWebpackPlugin } from "run-script-webpack-plugin"
import nodeExternals from "webpack-node-externals"

// This function takes the original object containing the default webpack configuration as a first
// argument, and the reference to the underlying webpack package used by the Nest CLI as the
// second one.
// And, it returns a modified webpack configuration with the HotModuleReplacementPlugin,
// WatchIgnorePlugin, and RunScriptWebpackPlugin plugins.
export default function (options, webpack) {
  return {
    ...options,
    entry: ["webpack/hot/poll?100", options.entry],
    externals: [
      nodeExternals({
        allowlist: ["webpack/hot/poll?100"]
      })
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/]
      }),
      new RunScriptWebpackPlugin({ name: options.output.filename, autoRestart: false })
    ]
  }
}
