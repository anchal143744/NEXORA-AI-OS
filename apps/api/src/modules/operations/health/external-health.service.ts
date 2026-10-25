import { Injectable } from '@nestjs/common';

type ExternalDependencyStatus = 'ok' | 'disabled' | 'error';

function productionRuntime() {
  return process.env.NODE_ENV === 'production';
}

function dependencyStatus(name: string, configured: boolean) {
  const production = productionRuntime();
  const status: ExternalDependencyStatus = configured ? 'ok' : production ? 'error' : 'disabled';
  return {
    status,
    configured,
    required: production,
    mode: process.env.NODE_ENV ?? 'development',
    message: configured
      ? `${name} configured.`
      : production
        ? `${name} is required in production.`
        : `${name} disabled in development mode.`,
  };
}

@Injectable()
export class ExternalHealthService {
  webhook() {
    return { status: 'ok', signing: 'enabled', replayProtection: 'enabled' };
  }

  aiProvider() {
    const providers = {
      openai: Boolean(process.env.OPENAI_API_KEY),
      anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
      gemini: Boolean(process.env.GEMINI_API_KEY),
      azureOpenAi: Boolean(process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT),
      local: Boolean(process.env.LOCAL_LLM_ENDPOINT),
    };
    return { ...dependencyStatus('AI provider', Object.values(providers).some(Boolean)), providers };
  }

  storage() {
    return dependencyStatus('Object storage', Boolean(process.env.S3_ENDPOINT && process.env.S3_BUCKET));
  }
}
