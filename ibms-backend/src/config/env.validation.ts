import { z } from 'zod';
import { Logger } from '@nestjs/common';

const envSchema = z.object({
  // Required — no defaults
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_PRIVATE_KEY_PATH: z.string().min(1, 'JWT_ACCESS_PRIVATE_KEY_PATH is required'),
  JWT_ACCESS_PUBLIC_KEY_PATH: z.string().min(1, 'JWT_ACCESS_PUBLIC_KEY_PATH is required'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  CORS_ORIGINS: z.string().min(1, 'CORS_ORIGINS is required'),
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),

  // Optional — with defaults
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  THROTTLE_TTL: z.coerce.number().int().positive().default(60),
  THROTTLE_LIMIT: z.coerce.number().int().positive().default(100),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  SWAGGER_ENABLED: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),

  // Redis (optional for Phase 1)
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  const logger = new Logger('EnvValidation');

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `  ✗ ${issue.path.join('.')}: ${issue.message}`,
    );

    logger.error(
      `\n\n🚨 Environment validation failed!\n\nMissing or invalid variables:\n${errors.join('\n')}\n\nSee .env.example for required variables.\n`,
    );

    process.exit(1);
  }

  return result.data;
}
