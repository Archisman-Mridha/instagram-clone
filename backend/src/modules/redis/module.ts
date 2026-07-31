import { createCluster, type RedisClusterOptions } from "@keyv/redis"
import {
	type DynamicModule,
	type FactoryProvider,
	Module,
	type ModuleMetadata
} from "@nestjs/common"

export const REDIS_CLUSTER_CLIENT = Symbol("REDIS_CLUSTER_CLIENT")

const REDIS_OPTIONS = Symbol("REDIS_OPTIONS")

interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
	inject?: FactoryProvider["inject"]
	useFactory: FactoryProvider<RedisClusterOptions>["useFactory"]
}

@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: required by the NestJS dynamic module pattern.
export class RedisModule {
	static register(clusterOptions: RedisClusterOptions & { isGlobal?: boolean }): DynamicModule {
		return {
			module: RedisModule,
			global: true,
			providers: [
				{ provide: REDIS_OPTIONS, useValue: clusterOptions },
				{
					provide: REDIS_CLUSTER_CLIENT,
					inject: [REDIS_OPTIONS],
					useFactory: (opts: RedisClusterOptions) => createCluster(opts)
				}
			],
			exports: [REDIS_CLUSTER_CLIENT]
		}
	}

	static registerAsync({ imports, inject, useFactory }: RedisModuleAsyncOptions): DynamicModule {
		return {
			module: RedisModule,
			global: true,
			imports: imports ?? [],
			providers: [
				{
					provide: REDIS_OPTIONS,
					inject: inject ?? [],
					useFactory
				},
				{
					provide: REDIS_CLUSTER_CLIENT,
					inject: [REDIS_OPTIONS],
					useFactory: (opts: RedisClusterOptions) => createCluster(opts)
				}
			],
			exports: [REDIS_CLUSTER_CLIENT]
		}
	}
}
