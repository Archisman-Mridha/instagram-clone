declare const module: any

import compression from "@fastify/compress"
import cookie from "@fastify/cookie"
import csrf from "@fastify/csrf-protection"
import helmet from "@fastify/helmet"
import secureSession from "@fastify/secure-session"
import { isDevelopmentEnvironment } from "@instagram-clone/lib/utils/utils"
import { ConsoleLogger, ValidationPipe, VersioningType } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"
import z from "zod"
import { ConfigSchema } from "./config/config"
import { RootModule } from "./modules/root/module"

async function main() {
  const app = await NestFactory.create<NestFastifyApplication>(RootModule, new FastifyAdapter(), {
    // All logs will be buffered until a custom logger is attached.
    bufferLogs: true,

    logger: new ConsoleLogger({
      json: !isDevelopmentEnvironment,
      colors: isDevelopmentEnvironment
    })
  })

  const configService = app.get(ConfigService<z.infer<typeof ConfigSchema>>)

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.getOrThrow("VERSION")
  })

  if (!isDevelopmentEnvironment) {
    // Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP
    // headers appropriately. Generally, Helmet is just a collection of smaller middleware
    // functions that set security-related HTTP headers.
    await app.register(helmet)

    // Cross-origin resource sharing (CORS) is a mechanism that allows resources to be requested
    // from another domain.
    app.enableCors()

    // Cross-site request forgery (CSRF or XSRF) is a type of attack where unauthorized commands
    // are sent from a trusted user to a web application.
    await app.register(csrf)
  }

  app.useGlobalPipes(
    new ValidationPipe({
      // Payloads coming in over the network are plain JavaScript objects.
      // This will automatically transform payloads to be objects typed according to their DTO
      // classes.
      transform: true
    })
  )

  // An HTTP cookie is a small piece of data stored by the user's browser. Cookies were designed to
  // be a reliable mechanism for websites to remember stateful information. When the user visits
  // the website again, the cookie is automatically sent with the request.
  await app.register(cookie, {
    secret: configService.getOrThrow<string>("COOKIE_ENCRYPTION_SECRET")
  })

  // HTTP sessions provide a way to store information about the user across multiple requests.
  await app.register(secureSession, {
    // The secret is used to sign the session ID cookie.
    // This can be either a string for a single secret, or an array of multiple secrets. If an
    // array of secrets is provided, only the first element will be used to sign the session ID
    // cookie, while all the elements will be considered when verifying the signature in requests.
    secret: configService.getOrThrow<string>("SESSION_ENCRYPTION_SECRET"),

    salt: configService.getOrThrow<string>("SESSION_ENCRYPTION_SALT")
  })

  /*
    NOTE : By default, @fastify/compress will use Brotli compression (on Node >= 11.7.0) when
           browsers indicate support for the encoding. While Brotli can be quite efficient in
           terms of compression ratio, it can also be quite slow. By default, Brotli sets a
           maximum compression quality of 11, although it can be adjusted to reduce compression
           time in lieu of compression quality by adjusting the BROTLI_PARAM_QUALITY between 0 min
           and 11 max.
  */
  await app.register(compression)

  const port = configService.getOrThrow("PORT")
  await app.listen(port)

  // Enable HMR (Hot Module Replacement) during development.
  // The highest impact on your application's bootstrapping process is TypeScript compilation.
  // Fortunately, with webpack HMR, we don't need to recompile the entire project each time a
  // change occurs. This significantly decreases the amount of time necessary to instantiate your
  // application, and makes iterative development a lot easier.
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

main()
