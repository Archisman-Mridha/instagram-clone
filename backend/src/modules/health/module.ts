import { Module } from "@nestjs/common"
import { TerminusModule } from "@nestjs/terminus"
import { RedisModule } from "../redis/module"
import { HealthController } from "./controller"

@Module({
  imports: [TerminusModule, RedisModule],
  controllers: [HealthController]
})
export class HealthModule {}
