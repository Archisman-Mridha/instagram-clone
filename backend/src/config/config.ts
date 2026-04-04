import z from "zod"

const DEFAULT_PORT = 4000

const DEFAULT_JWT_EXPIRES_AFTER = "12h"

export const ConfigSchema = z.object({
  VERSION: z.string(),

  PORT: z.coerce.number().nonnegative().default(DEFAULT_PORT),

  JWT_ISSUER: z.string(),
  JWT_AUDIENCE: z.string(),
  JWT_SIGNING_SECRET: z.string(),
  JWT_EXPIRES_AFTER: z.string().default(DEFAULT_JWT_EXPIRES_AFTER),

  COOKIE_ENCRYPTION_SECRET: z.string(),

  SESSION_ENCRYPTION_SECRET: z.string(),
  SESSION_ENCRYPTION_SALT: z.string(),

  POSTGRES_URL: z.string(),

  MONGO_URI: z.string(),

  ELASTICSEARCH_NODES: z.string(),

  REDPANDA_BROKERS: z.string(),
  REDPANDA_USERNAME: z.string().optional(),
  REDPANDA_PASSWORD: z.string().optional(),

  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_BUCKET: z.string(),

  REDIS_CLUSTER_NODES: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),

  OTEL_COLLECTOR_URL: z.string()
})
