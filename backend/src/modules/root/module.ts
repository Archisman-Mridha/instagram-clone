import { ApolloServerPlugin } from "@apollo/server"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { KeyvAdapter } from "@apollo/utils.keyvadapter"
import KeyvRedis, { RedisClusterType } from "@keyv/redis"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { CqrsModule } from "@nestjs/cqrs"
import { DevtoolsModule } from "@nestjs/devtools-integration"
import { GraphQLModule, GraphQLSchemaHost } from "@nestjs/graphql"
import { MongooseModule } from "@nestjs/mongoose"
import { TypeOrmModule } from "@nestjs/typeorm"
import Keyv from "keyv"
import { GraphQLQueryComplexityPlugin } from "src/graphql/plugins/query-complexity"
import { Provider } from "src/utils/providers"
import z from "zod"
import { ConfigSchema } from "../../config/config"
import { AuthModule } from "../auth/module"
import { FeedsModule } from "../feeds/module"
import { FollowshipsModule } from "../followships/module"
import { HealthModule } from "../health/module"
import { NotificationsModule } from "../notifications/module"
import { PingModule } from "../ping/module"
import { PostsModule } from "../posts/module"
import { ProfilesModule } from "../profiles/module"
import { RedisModule } from "../redis/module"
import { TelemetryModule } from "../telemetry/module"
import { UsersModule } from "../users/module"

export const isDevelopmentEnvironment = process.env.NODE_ENV === "development"

const GRAPHQL_SCHEMA_FILE_PATH = "generated/graphql/schema.graphql"

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

    CqrsModule.forRoot(),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,

      imports: [RedisModule],
      inject: [Provider.REDIS_CLUSTER_CLIENT, GraphQLSchemaHost],
      useFactory: (redisClusterClient: RedisClusterType, graphQLSchemaHost: GraphQLSchemaHost) => ({
        buildSchemaOptions: {
          // The GraphQLISODateTime (e.g. 2019-12-03T09:54:33Z) is used by default to represent the
          // Date type. We instead want to use the GraphQLTimestamp type.
          dateScalarMode: "timestamp"
        },

        cache: new KeyvAdapter(
          new Keyv({
            store: new KeyvRedis(redisClusterClient)
          }),
          { disableBatchReads: true }
        ),

        // To improve network performance for large query strings, Apollo Server supports
        // Automatic Persisted Queries (APQ). A persisted query is a query string that's cached on
        // the server side, along with its unique identifier (always its SHA-256 hash). Clients can
        // send this identifier instead of the corresponding query string, thus reducing request
        // sizes dramatically (response sizes are unaffected).
        persistedQueries: {
          ttl: null
        },

        autoSchemaFile: GRAPHQL_SCHEMA_FILE_PATH,
        sortSchema: true,

        introspection: true,
        playground: false,
        plugins: getGraphQLServerPlugins(graphQLSchemaHost)
      })
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<z.infer<typeof ConfigSchema>>) => ({
        type: "postgres",
        url: configService.getOrThrow("POSTGRES_URL"),

        autoLoadEntities: true,

        migrations: ["generated/migrations/**"],
        migrationsRun: true,

        // Indicates if database schema should be auto created on every application launch.
        // NOTE : Be careful with this option and don't use this in production - otherwise you can
        //        loose production data.
        synchronize: isDevelopmentEnvironment
        // logging: isDevelopmentEnvironment
      })
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<z.infer<typeof ConfigSchema>>) => ({
        uri: configService.getOrThrow("MONGO_URI"),
        serverSelectionTimeoutMS: 5000,
        retryAttempts: 0
      })
    }),

    PingModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
    FollowshipsModule,
    PostsModule,
    FeedsModule,
    NotificationsModule,

    HealthModule,
    TelemetryModule,

    DevtoolsModule.register({ http: isDevelopmentEnvironment })
  ]
})
export class RootModule {}

// Returns the GraphQL server plugins to be used.
function getGraphQLServerPlugins(graphQLSchemaHost: GraphQLSchemaHost): ApolloServerPlugin[] {
  const plugins: ApolloServerPlugin[] = []

  if (isDevelopmentEnvironment) plugins.concat([ApolloServerPluginLandingPageLocalDefault()])
  else plugins.concat([new GraphQLQueryComplexityPlugin(graphQLSchemaHost)])

  return plugins
}
