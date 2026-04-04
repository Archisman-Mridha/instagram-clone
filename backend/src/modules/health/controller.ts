import type { RedisClusterType } from "@keyv/redis"
import { Controller, Get, Inject } from "@nestjs/common"
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MongooseHealthIndicator,
  HealthIndicatorService
} from "@nestjs/terminus"
import { Provider } from "src/utils/providers"

@Controller("health")
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly healthIndicatorService: HealthIndicatorService,

    private readonly db: TypeOrmHealthIndicator,
    private readonly mongoose: MongooseHealthIndicator,

    @Inject(Provider.REDIS_CLUSTER_CLIENT)
    private readonly redisClusterClient: RedisClusterType
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthService.check([
      // Postgres connection.
      () => this.db.pingCheck("postgres"),

      // MongoDB connection.
      () => this.mongoose.pingCheck("mongodb"),

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
