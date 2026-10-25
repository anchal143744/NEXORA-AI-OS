import { pathToFileURL } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JwtService } from '@nestjs/jwt';

const root = process.cwd();
const failures = [];
const validSecret = 'nexora-development-jwt-secret-for-runtime-validation-2026';

function fail(message) {
  failures.push(message);
}

function expectThrows(name, action) {
  try {
    action();
    fail(`${name} did not reject unsafe configuration`);
  } catch {
    return;
  }
}

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

const authCoreSource = read('apps/api/src/modules/auth/auth-core.module.ts');
if (authCoreSource.includes("|| 'secret'") || authCoreSource.includes('|| "secret"')) {
  fail('AuthCoreModule still contains a known JWT fallback secret.');
}

const validationSource = read('apps/api/src/config/env.validation.ts');
for (const knownUnsafe of ['secret', 'default', 'changeme']) {
  if (!validationSource.includes(knownUnsafe)) fail(`Environment validation does not explicitly reject ${knownUnsafe}.`);
}

const validationModulePath = join(root, 'apps/api/dist/config/env.validation.js');
const tokenServiceModulePath = join(root, 'apps/api/dist/modules/auth/tokens/token.service.js');
if (!existsSync(validationModulePath) || !existsSync(tokenServiceModulePath)) {
  fail('Built API artifacts are missing. Run npm.cmd run api:build before JWT security validation.');
} else {
  const [{ validateEnvironment }, { TokenService }] = await Promise.all([
    import(pathToFileURL(validationModulePath).href + '?v=' + Date.now()),
    import(pathToFileURL(tokenServiceModulePath).href + '?v=' + Date.now()),
  ]);

  const valid = validateEnvironment({
    NODE_ENV: 'development',
    PORT: '4000',
    DATABASE_URL: 'postgresql://user:password@localhost:5432/nexora',
    JWT_SECRET: validSecret,
  });
  if (valid.JWT_SECRET !== validSecret) fail('Configured JWT_SECRET was not preserved by environment validation.');

  expectThrows('Missing production JWT_SECRET', () => validateEnvironment({
    NODE_ENV: 'production',
    PORT: '4000',
    DATABASE_URL: 'postgresql://user:password@localhost:5432/nexora',
  }));

  expectThrows('Known unsafe JWT_SECRET', () => validateEnvironment({
    NODE_ENV: 'development',
    PORT: '4000',
    DATABASE_URL: 'postgresql://user:password@localhost:5432/nexora',
    JWT_SECRET: 'secret',
  }));

  const tokenService = new TokenService(new JwtService({ secret: validSecret }));
  const tokenPair = await tokenService.issueTokenPair({
    sub: '11111111-1111-4111-8111-111111111111',
    userId: '11111111-1111-4111-8111-111111111111',
    tenantId: '22222222-2222-4222-8222-222222222222',
    organizationId: '33333333-3333-4333-8333-333333333333',
    workspaceId: '44444444-4444-4444-8444-444444444444',
    sessionId: '55555555-5555-4555-8555-555555555555',
    role: 'ADMIN',
    roles: ['ADMIN'],
    permissions: ['read'],
  });
  const payload = await tokenService.verifyAccessToken(tokenPair.accessToken);
  if (payload.userId !== payload.sub || payload.tenantId !== '22222222-2222-4222-8222-222222222222') {
    fail('Issued JWT payload did not round-trip through TokenService verification.');
  }
}

console.log(JSON.stringify({
  status: failures.length === 0 ? 'passed' : 'failed',
  checkedAt: new Date().toISOString(),
  failures,
}, null, 2));

if (failures.length) process.exit(1);
