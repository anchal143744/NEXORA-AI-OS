export type PublicRuntimeEnv = {
  apiBaseUrl: string;
  appEnv: 'development' | 'staging' | 'production';
  releaseVersion: string;
};

const fallbackApiUrl = '/api';

export const publicRuntimeEnv: PublicRuntimeEnv = validatePublicRuntimeEnv({
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? fallbackApiUrl,
  appEnv: normalizeAppEnv(process.env.NEXT_PUBLIC_APP_ENV),
  releaseVersion: process.env.NEXT_PUBLIC_RELEASE_VERSION ?? '1.6.0',
});

export function validatePublicRuntimeEnv(input: PublicRuntimeEnv): PublicRuntimeEnv {
  return {
    apiBaseUrl: normalizeApiBaseUrl(input.apiBaseUrl),
    appEnv: input.appEnv,
    releaseVersion: input.releaseVersion.trim() || '1.6.0',
  };
}

function normalizeAppEnv(value: string | undefined): PublicRuntimeEnv['appEnv'] {
  if (value === 'production' || value === 'staging' || value === 'development') return value;
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

function normalizeApiBaseUrl(value: string) {
  const trimmed = value.trim() || fallbackApiUrl;
  if (/^https?:\/\//i.test(trimmed)) return new URL(trimmed).pathname.replace(/\/$/, '') || fallbackApiUrl;
  if (trimmed.startsWith('/')) return trimmed.replace(/\/$/, '') || fallbackApiUrl;
  return fallbackApiUrl;
}
