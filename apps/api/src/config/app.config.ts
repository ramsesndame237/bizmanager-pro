import { registerAs } from '@nestjs/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  MINIO_ENDPOINT: z.string().default('localhost'),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
  PDF_ENGINE_URL: z.string().url().default('http://localhost:8080'),
  WEB_URL: z.string().url().default('http://localhost:3000'),
  MOBILE_URL: z.string().url().default('http://localhost:3002'),
})

export type AppConfig = z.infer<typeof envSchema>

export const appConfig = registerAs('app', () => {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten().fieldErrors)
    throw new Error('Invalid environment configuration')
  }

  return result.data
})
