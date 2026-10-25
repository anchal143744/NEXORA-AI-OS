const SENSITIVE_KEY_PATTERNS = [/password/i, /passcode/i, /token/i, /secret/i, /authorization/i, /^cookie$/i, /api[-_]?key/i, /private[-_]?key/i, /credential/i, /session/i, /refresh/i, /otp/i, /mfa/i];
const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const BEARER_PATTERN = /^Bearer\s+/i;

export function redactSensitive<T>(input: T): T {
  return redactValue(input, new WeakSet<object>(), 0) as T;
}

function redactValue(value: unknown, seen: WeakSet<object>, depth: number): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return JWT_PATTERN.test(value) || BEARER_PATTERN.test(value) ? '[REDACTED]' : value;
  if (typeof value !== 'object') return value;
  if (value instanceof Error) return { name: value.name, message: value.message, stack: value.stack };
  if (value instanceof Date) return value.toISOString();
  if (depth > 8) return '[MAX_DEPTH]';
  if (seen.has(value)) return '[CIRCULAR]';
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => redactValue(item, seen, depth + 1));
  const output: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) output[key] = isSensitiveKey(key) ? '[REDACTED]' : redactValue(item, seen, depth + 1);
  return output;
}

function isSensitiveKey(key: string) {
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}