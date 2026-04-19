import { KeyvAdapter } from "@apollo/utils.keyvadapter"
import { GraphQLQueryComplexityPlugin } from "@instagram-clone/lib/graphql/plugins/query-complexity"
import { REDIS_CLUSTER_CLIENT, RedisModule } from "@instagram-clone/lib/modules/redis/module"
import { S3Module } from "@instagram-clone/lib/modules/s3/module"
import { TelemetryModule } from "@instagram-clone/lib/modules/telemetry/module"
import { isDevelopmentEnvironment } from "@instagram-clone/lib/utils/utils"
import KeyvRedis, { RedisClusterType } from "@keyv/redis"
import { ApolloFederationDriver, ApolloFederationDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { CqrsModule } from "@nestjs/cqrs"
import { GraphQLModule } from "@nestjs/graphql"
import { TypeOrmModule } from "@nestjs/typeorm"
import Keyv from "keyv"
import z from "zod"
import { ConfigSchema } from "../../config/config"
import { HealthModule } from "../health/module"
import { PostsModule } from "../posts/module"

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

    RedisModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<z.infer<typeof ConfigSchema>>) => {
        const rootNodes = configService
          .getOrThrow<string>("REDIS_CLUSTER_NODES")
          .split(",")
          .map((url: string) => ({ url }))

        return {
          rootNodes,

          defaults: {
            username: configService.getOrThrow("REDIS_USERNAME"),
            password: configService.getOrThrow("REDIS_PASSWORD")
          }
        }
      }
    }),

    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,

      inject: [REDIS_CLUSTER_CLIENT],
      useFactory: (redisClusterClient: RedisClusterType) => ({
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

        autoSchemaFile: {
          federation: 2
        },

        introspection: true,
        playground: false
      })
    }),

    CqrsModule.forRoot(),

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

    S3Module.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<z.infer<typeof ConfigSchema>>) => {
        return {
          region: configService.getOrThrow("AWS_REGION"),
          credentials: {
            accessKeyId: configService.getOrThrow("AWS_ACCESS_KEY_ID"),
            secretAccessKey: configService.getOrThrow("AWS_SECRET_ACCESS_KEY")
          }
        }
      }
    }),

    PostsModule,

    HealthModule,
    TelemetryModule

    // DevtoolsModule.register({ http: isDevelopmentEnvironment })
  ],
  providers: [GraphQLQueryComplexityPlugin]
})
export class RootModule {}
