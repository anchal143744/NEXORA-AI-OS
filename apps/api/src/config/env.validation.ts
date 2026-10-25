import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_DEFAULT_MODEL: z.string().default('gpt-4.1-mini'),
});

const unsafeJwtSecrets = new Set([
  'secret',
  'default',
  'changeme',
  'change-me',
  'password',
  'jwt_secret',
  'development',
  'nexora',
]);

export function validateEnvironment(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
  }
  const jwtSecret = parsed.data.JWT_SECRET.trim();
  if (unsafeJwtSecrets.has(jwtSecret.toLowerCase())) {
    throw new Error('Invalid environment configuration: JWT_SECRET must not use a known unsafe value');
  }
  if (parsed.data.NODE_ENV === 'production' && jwtSecret.length < 48) {
    throw new Error('Invalid environment configuration: production JWT_SECRET must be at least 48 characters');
  }
  return parsed.data;
}
