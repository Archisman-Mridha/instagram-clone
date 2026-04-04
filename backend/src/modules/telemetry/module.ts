import { Module } from "@nestjs/common"
import { TelemetryService } from "./service"

@Module({
  providers: [TelemetryService]
})
export class TelemetryModule {}
