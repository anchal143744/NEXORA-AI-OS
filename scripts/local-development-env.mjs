import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = fileURLToPath(new URL('../', import.meta.url));
export function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const values = {};
  for (const line of fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const match = line.trim().match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    else value = value.replace(/\s+#.*$/, '').trim();
    values[match[1]] = value;
  }
  return values;
}
export function loadLocalDevelopmentEnv(root = repoRoot, inherited = process.env) {
  // Match Nest's development precedence. Inherited process variables take priority.
  const fileEnv = Object.assign({}, ...['.env', '.env.local', '.env.development', '.env.development.local'].map(file => parseEnvFile(path.join(root, file))));
  return { ...fileEnv, ...inherited, NODE_ENV: inherited.NODE_ENV ?? fileEnv.NODE_ENV ?? 'development', PORT: inherited.PORT ?? fileEnv.PORT ?? '4000', NEXT_PUBLIC_API_URL: inherited.NEXT_PUBLIC_API_URL ?? fileEnv.NEXT_PUBLIC_API_URL ?? '/api', NEXORA_API_INTERNAL_URL: inherited.NEXORA_API_INTERNAL_URL ?? fileEnv.NEXORA_API_INTERNAL_URL ?? 'http://localhost:4000', NEXORA_IGNORE_ENV_FILE: 'true' };
}
export function localDatabaseAddress(env) {
  if (env.NODE_ENV !== 'development') throw new Error('Local development commands require NODE_ENV=development.');
  if (!env.DATABASE_URL?.trim()) throw new Error('DATABASE_URL is missing. Configure the repository .env file.');
  let parsed;
  try { parsed = new URL(env.DATABASE_URL); } catch { throw new Error('DATABASE_URL is malformed; its value is withheld.'); }
  if (!['postgresql:', 'postgres:'].includes(parsed.protocol) || !['127.0.0.1', 'localhost', '[::1]', '::1'].includes(parsed.hostname) || !parsed.pathname.slice(1)) throw new Error('Local development requires a loopback PostgreSQL URL with a database name.');
  return { host: parsed.hostname, port: Number(parsed.port || 5432), database: parsed.pathname.slice(1), schema: parsed.searchParams.get('schema') || 'public' };
}
export function redactLocalSecrets(text, env) {
  let safe = String(text);
  const secrets = Object.entries(env).filter(([name, value]) => value && /SECRET|PASSWORD|TOKEN|API_KEY|DATABASE_URL|DIRECT_URL|SHADOW_DATABASE_URL|SMTP_PASS|SMTP_USER|REDIS_URL/.test(name)).map(([,value]) => String(value));
  for (const name of ['DATABASE_URL', 'DIRECT_URL', 'SHADOW_DATABASE_URL', 'REDIS_URL']) {
    try { const url = new URL(env[name]); if (url.password) secrets.push(url.password, decodeURIComponent(url.password)); } catch {}
  }
  for (const value of secrets.sort((a,b) => b.length - a.length)) safe = safe.split(value).join('[redacted]');
  return safe.replace(/(?:postgres(?:ql)?|rediss?):\/\/[^\s"'`]+/gi, '[redacted connection URL]');
}
export async function checkLocalDatabase(env) {
  const { schema } = localDatabaseAddress(env);
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } }, log: [] });
  try {
    const rows = await prisma.$queryRaw`SELECT 1 AS connected`;
    if (rows[0]?.connected !== 1) throw new Error('Unexpected connectivity result');
    const tables = await prisma.$queryRaw`SELECT to_regclass(quote_ident(${schema}) || '."Tenant"') IS NOT NULL AS tenant, to_regclass(quote_ident(${schema}) || '."Invoice"') IS NOT NULL AS invoice, to_regclass(quote_ident(${schema}) || '."RetailSale"') IS NOT NULL AS retail`;
    if (!tables[0]?.tenant || !tables[0]?.invoice || !tables[0]?.retail) throw new Error('Database connection succeeded, but the NEXORA schema is not initialized. Apply reviewed migrations explicitly to an owned development database.');
    return { connected: true, schemaPresent: true };
  } catch (error) {
    const message = redactLocalSecrets(error.message ?? 'Database check failed', env);
    throw new Error(message, { cause: undefined });
  } finally { await prisma.$disconnect(); }
}
