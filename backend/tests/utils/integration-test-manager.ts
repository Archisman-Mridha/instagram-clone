import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { RootModule } from "src/modules/root/module"

export class IntegrationTestManager {
  app: INestApplication
  httpServer: any

  async beforeAll(): Promise<void> {
    const moduleRef = await Test.createTestingModule({
      imports: [RootModule]
    }).compile()

    this.app = moduleRef.createNestApplication()

    await this.app.init()

    this.httpServer = this.app.getHttpServer()
  }
}
