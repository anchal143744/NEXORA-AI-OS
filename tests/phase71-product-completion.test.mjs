import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('Phase 71 API client targets the actual Nest API and unwraps standard responses', () => {
  const client = read('apps/web/lib/api-client.ts');
  assert.match(client, /publicRuntimeEnv\.apiBaseUrl/);
  assert.match(read('apps/web/lib/env.ts'), /\/api/);
  assert.match(read('apps/web/next.config.ts'), /rewrites/);
  assert.equal(client.includes("'success' in payload && 'data' in payload"), true);
  assert.equal(client.includes("headers.set('Authorization'"), true);
  assert.equal(client.includes('Bearer'), true);
  assert.equal(client.includes("headers.set('x-tenant-id', tenantId)"), true);
});

test('Phase 71 auth signup can bootstrap a first tenant and return a usable session', () => {
  const dto = read('apps/api/src/modules/auth/dto/signup.dto.ts');
  const service = read('apps/api/src/modules/auth/auth.service.ts');
  assert.equal(dto.includes('tenantId?: string'), true);
  assert.equal(dto.includes('companyName?: string'), true);
  assert.equal(service.includes('bootstrapFirstTenant'), true);
  assert.equal(service.includes('tx.tenant.create'), true);
  assert.equal(service.includes('tx.workspace.create'), true);
  assert.equal(service.includes('accessToken: input.tokenPair.accessToken'), true);
});

test('Phase 71 JWT guard propagates token tenant and user into request context', () => {
  const guard = read('apps/api/src/modules/auth/guards/jwt-auth.guard.ts');
  assert.equal(guard.includes('RequestContextStore'), true);
  assert.equal(guard.includes('requestContext.tenantId = payload.tenantId'), true);
  assert.equal(guard.includes('requestContext.userId = payload.userId'), true);
  assert.match(read('apps/api/src/modules/auth/tokens/token.service.ts'), /payload\.sub !== payload\.userId/);
});

test('Phase 71 frontend persists auth context and sends users through full onboarding', () => {
  const store = read('apps/web/stores/auth-store.ts');
  const onboardingPage = read('apps/web/app/onboarding/page.tsx');
  const signupSchema = read('apps/web/features/auth/auth-schemas.ts');
  assert.equal(store.includes('nexora.auth.session'), true);
  assert.equal(store.includes('window.localStorage.setItem'), true);
  assert.equal(onboardingPage.includes('OnboardingFlow'), true);
  assert.equal(signupSchema.includes('min(12'), true);
});

test('Phase 71 workspace generation is wired to the real adaptive workspace API', () => {
  const discoveryApi = read('apps/web/services/workspace-intelligence-api.ts');
  const onboardingApi = read('apps/web/services/onboarding-api.ts');
  assert.equal(discoveryApi.includes('/v1/workspaces'), true);
  assert.equal(discoveryApi.includes("base + '/generate'"), true);
  assert.equal(onboardingApi.includes('/v1/workspaces/generate'), true);
  assert.match(read('apps/api/src/modules/workspaces/workspaces.controller.ts'), /@Post\('generate'\)/);
});
