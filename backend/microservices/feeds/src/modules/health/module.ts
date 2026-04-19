import { RedisModule } from "@instagram-clone/lib/modules/redis/module"
import { Module } from "@nestjs/common"
import { TerminusModule } from "@nestjs/terminus"
import { HealthController } from "./controller"

@Module({
  imports: [TerminusModule, RedisModule],
  controllers: [HealthController]
})
export class HealthModule {}
