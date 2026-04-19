import { IntrospectAndCompose } from "@apollo/gateway"
import { ApolloServerPlugin } from "@apollo/server"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { GraphQLQueryComplexityPlugin } from "@instagram-clone/lib/graphql/plugins/query-complexity"
import { TelemetryModule } from "@instagram-clone/lib/modules/telemetry/module"
import { isDevelopmentEnvironment } from "@instagram-clone/lib/utils/utils"
import { ApolloGatewayDriverConfig, ApolloGatewayDriver } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { GraphQLModule, GraphQLSchemaHost } from "@nestjs/graphql"
import z from "zod"
import { ConfigSchema } from "../../config/config"

const GRAPHQL_SCHEMA_FILE_PATH = "frontend/src/graphql/generated/schema.graphql"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      expandVariables: true,
      cache: true,

      validate: (config) => {
        const parsedConfig = ConfigSchema.parse(config)
        return parsedConfig
      }
    }),

    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,

      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<z.infer<typeof ConfigSchema>>,
        graphQLSchemaHost: GraphQLSchemaHost
      ) => ({
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: "auth",
                url: configService.getOrThrow("AUTH_MICROSERVICE_URL")
              },
              {
                name: "profiles",
                url: configService.getOrThrow("PROFILES_MICROSERVICE_URL")
              },
              {
                name: "followships",
                url: configService.getOrThrow("FOLLOWSHIPS_MICROSERVICE_URL")
              },
              {
                name: "posts",
                url: configService.getOrThrow("POSTS_MICROSERVICE_URL")
              },
              {
                name: "feeds",
                url: configService.getOrThrow("FEEDS_MICROSERVICE_URL")
              }
            ]
          })
        },

        server: {
          // To improve network performance for large query strings, Apollo Server supports
          // Automatic Persisted Queries (APQ). A persisted query is a query string that's cached
          // on the server side, along with its unique identifier (always its SHA-256 hash).
          // Clients can send this identifier instead of the corresponding query string, thus
          // reducing request sizes dramatically (response sizes are unaffected).
          persistedQueries: {
            ttl: null
          },

          introspection: isDevelopmentEnvironment,
          playground: false,
          plugins: getGraphQLServerPlugins(graphQLSchemaHost)
        },

        autoSchemaFile: isDevelopmentEnvironment ? GRAPHQL_SCHEMA_FILE_PATH : true,
        sortSchema: true
      })
    }),

    TelemetryModule

    // DevtoolsModule.register({ http: isDevelopmentEnvironment })
  ]
})
export class RootModule {}

// Returns the GraphQL server plugins to be used.
function getGraphQLServerPlugins(graphQLSchemaHost: GraphQLSchemaHost): ApolloServerPlugin[] {
  const plugins: ApolloServerPlugin[] = []

  if (isDevelopmentEnvironment) plugins.push(ApolloServerPluginLandingPageLocalDefault())
  else plugins.concat(new GraphQLQueryComplexityPlugin(graphQLSchemaHost))

  return plugins
}
