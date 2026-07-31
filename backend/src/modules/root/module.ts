import type { ApolloServerPlugin } from "@apollo/server"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { KeyvAdapter } from "@apollo/utils.keyvadapter"
import KeyvRedis, { type RedisClusterType } from "@keyv/redis"
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { CqrsModule } from "@nestjs/cqrs"
import { GraphQLModule, GraphQLSchemaHost } from "@nestjs/graphql"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GraphQLQueryComplexityPlugin } from "@openmedia/backend/graphql/plugins/query-complexity"
import { MeilisearchModule } from "@openmedia/backend/modules/meilisearch/module"
import { REDIS_CLUSTER_CLIENT, RedisModule } from "@openmedia/backend/modules/redis/module"
import { TelemetryModule } from "@openmedia/backend/modules/telemetry/module"
import { isDevelopmentEnvironment } from "@openmedia/backend/utils/utils"
import Keyv from "keyv"
import type z from "zod"
import { ConfigSchema } from "../../config/config"
import { AuthModule } from "../business/auth/module"
import { FeedsModule } from "../business/feeds/module"
import { FollowshipsModule } from "../business/followships/module"
import { PostsModule } from "../business/posts/module"
import { ProfilesModule } from "../business/profiles/module"
import { UsersModule } from "../business/users/module"
import { HealthModule } from "../health/module"
import { PingModule } from "../ping/module"

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

		MeilisearchModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService<z.infer<typeof ConfigSchema>>) => ({
				host: configService.getOrThrow("MEILISEARCH_URL"),
				apiKey: configService.getOrThrow("MEILISEARCH_KEY")
			})
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

		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,

			inject: [REDIS_CLUSTER_CLIENT, GraphQLSchemaHost],
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

				autoSchemaFile: true,

				introspection: true,
				playground: false,
				plugins: getGraphQLServerPlugins(graphQLSchemaHost)
			})
		}),

		CqrsModule.forRoot(),

		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService<z.infer<typeof ConfigSchema>>) => ({
				type: "postgres",
				url: configService.getOrThrow("POSTGRES_URL"),

				autoLoadEntities: true

				// logging: isDevelopmentEnvironment
			})
		}),

		/*
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
    */

		PingModule,
		UsersModule,
		AuthModule,
		ProfilesModule,
		FollowshipsModule,
		PostsModule,
		FeedsModule,

		HealthModule,
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
