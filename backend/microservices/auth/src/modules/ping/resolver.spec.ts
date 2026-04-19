import { Test, TestingModule } from "@nestjs/testing"
import { PingResolver } from "./resolver"

describe("PingResolver", () => {
  let resolver: PingResolver

  beforeEach(async () => {
    /*
      NOTE :  The Test class is useful for providing an application execution context that
              essentially mocks the full Nest runtime, but gives you hooks that make it easy to
              manage class instances, including mocking and overriding.
    */
    const module: TestingModule = await Test.createTestingModule({
      providers: [PingResolver]
    }).compile()

    resolver = module.get<PingResolver>(PingResolver)
  })

  describe("ping", () => {
    it('should return "pong"', () => {
      expect(resolver.ping()).toBe("pong")
    })
  })
})
