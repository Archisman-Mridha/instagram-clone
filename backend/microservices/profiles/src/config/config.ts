import z from "zod"

const DEFAULT_PORT = 4000

export const ConfigSchema = z.object({
  VERSION: z.string(),

  PORT: z.coerce.number().nonnegative().default(DEFAULT_PORT),

  REDPANDA_BROKERS: z.string(),
  REDPANDA_USERNAME: z.string().optional(),
  REDPANDA_PASSWORD: z.string().optional(),

  POSTGRES_URL: z.string(),

  ELASTICSEARCH_NODES: z.string(),

  REDIS_CLUSTER_NODES: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),

  OTEL_COLLECTOR_URL: z.string()
})
