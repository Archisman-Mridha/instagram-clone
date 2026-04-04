//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { composePlugins, withNx } from "@nx/next"

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},

  // Configure the on-screen indicator that gives context about the current route you're viewing
  // during development.
  devIndicators: {
    position: "bottom-right"
  },

  // Opt out of the x-powered-by header added by default by NextJS.
  poweredByHeader: false,

  // In order to optimize applications, React Compiler automatically memoizes your code.
  // NextJS includes a custom performance optimization written in SWC that makes the React
  // Compiler more efficient. Instead of running the compiler on every file, NextJS analyzes your
  // project and only applies the React Compiler to relevant files. This avoids unnecessary work
  // and leads to faster builds compared to using the Babel plugin on its own.
  reactCompiler: true,

  // causes data fetching operations in the App Router to be excluded from prerenders unless they
  // are explicitly cached. This can be useful for optimizing the performance of uncached data
  // fetching in Server Components.
  // It is useful if your application requires fresh data fetching during runtime rather than
  // serving from a prerendered cache.
  cacheComponents: true,

  logging: {
    // forward browser console logs (such as console.log, console.warn, console.error) to the
    // terminal during development.
    browserToTerminal: true
  },

  // Next.js can statically type links to prevent typos and other errors when using next/link,
  // improving type safety when navigating between pages.
  typedRoutes: true,

  experimental: {
    // Enable statically typed links.
    // NOTE : This does not work with Turbopack.
    // typedRoutes: true,

    typedEnv: true,

    // Enables the new experimental View Transitions API in React. This API allows you to leverage
    // the native View Transitions browser API to create seamless transitions between UI states.
    viewTransition: true,

    // Use Lightning CSS, a fast CSS bundler and minifier, written in Rust.
    useLightningcss: true,

    // Some packages can export hundreds or thousands of modules, which can cause performance
    // issues in development and production.
    // Adding this will only load the modules you are actually using, while still giving you the
    // convenience of writing import statements with many named exports.
    optimizePackageImports: [],

    webpackMemoryOptimizations: true,

    // Run Webpack compilations inside a separate NodeJS worker which will decrease memory usage of
    // your application during builds.
    webpackBuildWorker: true,

    // Turbopack FileSystem Cache enables Turbopack to reduce work across next dev or next build
    // commands. When enabled, Turbopack will save and restore data to the .next folder between
    // builds, which can greatly speed up subsequent builds and dev sessions.
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true
  }
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx
]

export default composePlugins(...plugins)(nextConfig)
