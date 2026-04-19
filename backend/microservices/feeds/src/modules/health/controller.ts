import type { RedisClusterType } from "@keyv/redis"
import { REDIS_CLUSTER_CLIENT } from "@instagram-clone/lib/modules/redis/module"
import { Controller, Get, Inject } from "@nestjs/common"
import { HealthCheckService, HealthCheck, HealthIndicatorService } from "@nestjs/terminus"

@Controller("health")
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly healthIndicatorService: HealthIndicatorService,

    @Inject(REDIS_CLUSTER_CLIENT)
    private readonly redisClusterClient: RedisClusterType
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthService.check([
      // Redis connection.
      async () => {
        const indicator = this.healthIndicatorService.check("redis")
        try {
          await this.redisClusterClient.ping()
          return indicator.up()
        } catch (error) {
          return indicator.down({ message: (error as Error).message })
        }
      }
    ])
  }
}
