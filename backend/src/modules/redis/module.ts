import { createCluster, RedisClusterType } from "@keyv/redis"
import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ConfigSchema } from "src/config/config"
import { Provider } from "src/utils/providers"
import z from "zod"

@Module({
  providers: [
    {
      provide: Provider.REDIS_CLUSTER_CLIENT,

      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<z.infer<typeof ConfigSchema>>
      ): RedisClusterType => {
        const rootNodes = configService
          .getOrThrow<string>("REDIS_CLUSTER_NODES")
          .split(",")
          .map((url: string) => ({ url }))

        return createCluster({
          rootNodes,
          defaults: {
            username: configService.getOrThrow("REDIS_USERNAME"),
            password: configService.getOrThrow("REDIS_PASSWORD")
          }
        })
      }
    }
  ],
  exports: [Provider.REDIS_CLUSTER_CLIENT]
})
export class RedisModule {}
