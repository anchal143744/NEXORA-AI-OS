import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadLocalDevelopmentEnv, localDatabaseAddress, parseEnvFile, redactLocalSecrets } from '../scripts/local-development-env.mjs';

// Use synthetic fixtures only; never load the repository's real environment.
function fixture(t, files = {}) {
  const temporaryRoot = fs.realpathSync(os.tmpdir());
  const directory = fs.mkdtempSync(path.join(temporaryRoot, 'nexora-env-test-'));
  t.after(() => {
    const resolved = path.resolve(directory);
    assert.equal(path.dirname(resolved), temporaryRoot);
    assert.ok(path.basename(resolved).startsWith('nexora-env-test-'));
    fs.rmSync(resolved, { recursive: true, force: true });
  });
  for (const [name, contents] of Object.entries(files)) fs.writeFileSync(path.join(directory, name), contents);
  return directory;
}

const localEnv = url => ({ NODE_ENV: 'development', DATABASE_URL: url });

test('environment parser handles BOM, quoted values, exports, and inline comments', t => {
  const directory = fixture(t, {
    '.env': '\uFEFF# synthetic fixture\r\nexport NODE_ENV=development\r\nQUOTED="value # retained"\r\nSINGLE=\'quoted value\'\r\nUNQUOTED=value # removed\r\nEMPTY=\r\ninvalid line\r\n',
  });
  assert.deepEqual(parseEnvFile(path.join(directory, '.env')), {
    NODE_ENV: 'development', QUOTED: 'value # retained', SINGLE: 'quoted value', UNQUOTED: 'value', EMPTY: '',
  });
  assert.deepEqual(parseEnvFile(path.join(directory, 'missing.env')), {});
});

test('development environment precedence preserves higher-priority overrides', t => {
  const directory = fixture(t, {
    '.env': 'LAYER=base\nBASE_ONLY=retained\nLOCAL_WINS=base\nDEVELOPMENT_WINS=base\nPORT=4100\nNODE_ENV=development\n',
    '.env.local': 'LAYER=local\nLOCAL_ONLY=retained\nLOCAL_WINS=local\nDEVELOPMENT_WINS=local\n',
    '.env.development': 'LAYER=development\nDEVELOPMENT_ONLY=retained\nDEVELOPMENT_WINS=development\n',
    '.env.development.local': 'LAYER=development-local\nNEXORA_IGNORE_ENV_FILE=false\n',
  });
  const fromFiles = loadLocalDevelopmentEnv(directory, {});
  assert.equal(fromFiles.LAYER, 'development-local');
  assert.equal(fromFiles.BASE_ONLY, 'retained');
  assert.equal(fromFiles.LOCAL_ONLY, 'retained');
  assert.equal(fromFiles.DEVELOPMENT_ONLY, 'retained');
  assert.equal(fromFiles.LOCAL_WINS, 'local');
  assert.equal(fromFiles.DEVELOPMENT_WINS, 'development');
  assert.equal(fromFiles.PORT, '4100');
  assert.equal(fromFiles.NEXORA_IGNORE_ENV_FILE, 'true');
  const inherited = loadLocalDevelopmentEnv(directory, { LAYER: 'inherited', PORT: '4101' });
  assert.equal(inherited.LAYER, 'inherited');
  assert.equal(inherited.PORT, '4101');
});

test('missing fixture environment files produce development defaults', t => {
  const env = loadLocalDevelopmentEnv(fixture(t), {});
  assert.equal(env.NODE_ENV, 'development');
  assert.equal(env.PORT, '4000');
  assert.equal(env.NEXT_PUBLIC_API_URL, '/api');
  assert.equal(env.NEXORA_API_INTERNAL_URL, 'http://localhost:4000');
  assert.equal(env.DATABASE_URL, undefined);
});

test('local PostgreSQL URL accepts loopback targets and preserves explicit port', () => {
  assert.deepEqual(localDatabaseAddress(localEnv('postgresql://localhost/synthetic_dev')), {
    host: 'localhost', port: 5432, database: 'synthetic_dev', schema: 'public',
  });
  assert.deepEqual(localDatabaseAddress(localEnv('postgres://127.0.0.1:5433/synthetic_dev?schema=retail')), {
    host: '127.0.0.1', port: 5433, database: 'synthetic_dev', schema: 'retail',
  });
  assert.equal(localDatabaseAddress(localEnv('postgresql://[::1]:5433/synthetic_dev')).host, '[::1]');
});

test('local development rejects production, staging, test, and unspecified modes', () => {
  for (const mode of ['production', 'staging', 'test', undefined]) {
    assert.throws(() => localDatabaseAddress({ NODE_ENV: mode, DATABASE_URL: 'postgresql://localhost/synthetic_dev' }), /require NODE_ENV=development/);
  }
});

test('local development rejects missing or blank database URLs', () => {
  for (const url of [undefined, '', '   ']) assert.throws(() => localDatabaseAddress(localEnv(url)), /DATABASE_URL is missing/);
});

test('malformed URL errors withhold the supplied connection value', () => {
  const synthetic = 'malformed-synthetic-private-connection';
  assert.throws(() => localDatabaseAddress(localEnv(synthetic)), error => {
    assert.match(error.message, /malformed/);
    assert.ok(!error.message.includes(synthetic));
    return true;
  });
});

test('local development rejects remote hosts, wrong protocols, and unnamed databases', () => {
  for (const url of [
    'postgresql://db.example.invalid/synthetic_dev',
    'postgresql://192.0.2.20/synthetic_dev',
    'postgresql://localhost.example.invalid/synthetic_dev',
    'mysql://localhost/synthetic_dev',
    'https://localhost/synthetic_dev',
    'postgresql://localhost/',
  ]) assert.throws(() => localDatabaseAddress(localEnv(url)), /loopback PostgreSQL URL with a database name/);
});

test('database URL schema selection decodes names and defaults to public', () => {
  assert.equal(localDatabaseAddress(localEnv('postgresql://localhost/synthetic_dev?schema=retail%20test')).schema, 'retail test');
  assert.equal(localDatabaseAddress(localEnv('postgresql://localhost/synthetic_dev?schema=')).schema, 'public');
});

test('credential redaction removes configured secrets and encoded connection passwords', () => {
  const env = {
    DATABASE_URL: 'postgresql://synthetic:db%40synthetic%21@localhost/synthetic_dev',
    DIRECT_URL: 'postgresql://synthetic:direct%40synthetic%21@localhost/synthetic_dev',
    SHADOW_DATABASE_URL: 'postgresql://synthetic:shadow%40synthetic%21@localhost/synthetic_shadow',
    REDIS_URL: 'rediss://synthetic:redis%40synthetic%21@localhost:6379',
    JWT_SECRET: 'jwt-synthetic-fixture-secret',
    SMTP_PASS: 'smtp-synthetic-fixture-password',
    SMTP_USER: 'smtp-synthetic-fixture-user',
    OPENAI_API_KEY: 'ai-synthetic-fixture-key',
    ACCESS_TOKEN: 'access-synthetic-fixture-token',
  };
  const passwords = ['db@synthetic!', 'db%40synthetic%21', 'direct@synthetic!', 'shadow@synthetic!', 'redis@synthetic!'];
  const input = ['connection failure', ...Object.values(env), ...passwords].join(' | ');
  const safe = redactLocalSecrets(input, env);
  for (const value of [...Object.values(env), ...passwords]) assert.ok(!safe.includes(value), 'Synthetic credentials must be redacted');
  assert.ok(safe.includes('connection failure'));
  assert.ok(safe.includes('[redacted]'));
});

test('unconfigured PostgreSQL and Redis connection URLs are also redacted', () => {
  const safe = redactLocalSecrets('failed postgresql://synthetic:fixture@localhost/dev redis://synthetic:fixture@localhost:6379 rediss://synthetic:fixture@localhost:6380', {});
  assert.ok(!safe.includes('synthetic:fixture'));
  assert.equal((safe.match(/\[redacted connection URL\]/g) ?? []).length, 3);
});

test('redaction preserves useful nonsecret diagnostics', () => {
  assert.equal(redactLocalSecrets('PostgreSQL unavailable; retry local startup.', {}), 'PostgreSQL unavailable; retry local startup.');
});
