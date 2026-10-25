import { Injectable } from '@nestjs/common';

function hasValue(key: string) {
  return Boolean(process.env[key]?.trim());
}

function aiProviderConfigured() {
  return Boolean(
    process.env.OPENAI_API_KEY?.trim()
      || process.env.ANTHROPIC_API_KEY?.trim()
      || process.env.GEMINI_API_KEY?.trim()
      || (process.env.AZURE_OPENAI_API_KEY?.trim() && process.env.AZURE_OPENAI_ENDPOINT?.trim())
      || process.env.LOCAL_LLM_ENDPOINT?.trim(),
  );
}

@Injectable()
export class EnvironmentValidationService {
  validate() {
    const production = process.env.NODE_ENV === 'production';
    const required = [
      'DATABASE_URL',
      'JWT_SECRET',
      ...(production ? ['REDIS_URL', 'S3_ENDPOINT', 'S3_BUCKET'] : []),
    ];
    const missing = required.filter((key) => !hasValue(key));
    if (production && !aiProviderConfigured()) missing.push('AI_PROVIDER');

    return {
      valid: missing.length === 0,
      mode: process.env.NODE_ENV ?? 'development',
      required,
      missing,
      optional: {
        redis: hasValue('REDIS_URL'),
        aiProvider: aiProviderConfigured(),
        storage: hasValue('S3_ENDPOINT') && hasValue('S3_BUCKET'),
      },
    };
  }
}
