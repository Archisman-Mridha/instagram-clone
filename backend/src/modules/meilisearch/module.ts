import {
	type DynamicModule,
	type FactoryProvider,
	Module,
	type ModuleMetadata
} from "@nestjs/common"
import { type Config, Meilisearch } from "meilisearch"

export const MEILISEARCH_CLIENT = Symbol("MEILISEARCH_CLIENT")

const MEILISEARCH_OPTIONS = Symbol("MEILISEARCH_OPTIONS")

interface MeilisearchModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
	inject?: FactoryProvider["inject"]
	useFactory: FactoryProvider<Config>["useFactory"]
}

@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: required by the NestJS dynamic module pattern.
export class MeilisearchModule {
	static register(config: Config): DynamicModule {
		return {
			module: MeilisearchModule,
			global: true,
			providers: [
				{
					provide: MEILISEARCH_CLIENT,
					useValue: new Meilisearch(config)
				}
			],
			exports: [MEILISEARCH_CLIENT]
		}
	}

	static registerAsync({
		imports,
		inject,
		useFactory
	}: MeilisearchModuleAsyncOptions): DynamicModule {
		return {
			module: MeilisearchModule,
			global: true,
			imports: imports ?? [],
			providers: [
				{
					provide: MEILISEARCH_OPTIONS,
					inject: inject ?? [],
					useFactory
				},
				{
					provide: MEILISEARCH_CLIENT,
					inject: [MEILISEARCH_OPTIONS],
					useFactory: (config: Config) => new Meilisearch(config)
				}
			],
			exports: [MEILISEARCH_CLIENT]
		}
	}
}
