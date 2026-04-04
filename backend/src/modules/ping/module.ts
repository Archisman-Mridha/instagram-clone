import { Module } from "@nestjs/common"
import { PingResolver } from "./resolver"

@Module({
  providers: [PingResolver]
})
export class PingModule {}
