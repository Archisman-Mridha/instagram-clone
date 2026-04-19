import type { RedisClusterType } from "@keyv/redis"
import { REDIS_CLUSTER_CLIENT } from "@instagram-clone/lib/modules/redis/module"
import { Controller, Get, Inject } from "@nestjs/common"
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  HealthIndicatorService
} from "@nestjs/terminus"

@Controller("health")
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly healthIndicatorService: HealthIndicatorService,

    private readonly db: TypeOrmHealthIndicator,

    @Inject(REDIS_CLUSTER_CLIENT)
    private readonly redisClusterClient: RedisClusterType
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthService.check([
      // TODO : Redpanda connection.

      // Postgres connection.
      () => this.db.pingCheck("postgres"),

      // TODO : Elasticsearch connection.

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
