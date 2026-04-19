import z from "zod"

const DEFAULT_PORT = 4000

export const ConfigSchema = z.object({
  VERSION: z.string(),

  PORT: z.coerce.number().nonnegative().default(DEFAULT_PORT),

  POSTGRES_URL: z.string(),

  REDIS_CLUSTER_NODES: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),

  OTEL_COLLECTOR_URL: z.string()
})
