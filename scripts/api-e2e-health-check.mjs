import { spawn } from 'node:child_process';

import net from 'node:net';
import { assertDisposableRuntimeDatabase } from './test-fixtures/runtime-membership.mjs';

let baseUrl;
const failures = [];
let child;
let childError;
let childStdout = '';
let childStderr = '';

function fail(message) {
  failures.push(message);
}

async function request(path, options = {}) {
  assertOwnedApiAlive();
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    body = text;
  }
  return { response, body };
}

async function safeRequest(path, options = {}) {
  try {
    return await request(path, options);
  } catch (error) {
    return { error };
  }
}

async function waitForApi(timeoutMs = 25_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    assertOwnedApiAlive();
    const result = await safeRequest('/api/v1/health/live');
    if (result.response?.ok) { assertOwnedApiAlive(); return true; }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

async function ensureApi() {
  assertDisposableRuntimeDatabase();
  if (process.env.NEXORA_API_URL) throw new Error('API e2e refuses an existing endpoint; it must start its own disposable API');
  const port = await new Promise((resolve, reject) => {
    const reservation = net.createServer();
    reservation.once('error', reject);
    reservation.listen(0, '127.0.0.1', () => {
      const chosen = reservation.address().port;
      reservation.close(error => error ? reject(error) : resolve(chosen));
    });
  });
  baseUrl = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, ['apps/api/dist/main.js'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(port), API_PORT: String(port), NODE_ENV: process.env.NODE_ENV || 'development' },
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.once('error', error => { childError = error; });
  child.stdout.on('data', (chunk) => { childStdout += chunk.toString(); });
  child.stderr.on('data', (chunk) => { childStderr += chunk.toString(); });
  const online = await waitForApi(25_000);
  if (!online) {
    throw new Error(`Owned API did not become healthy within 25 seconds. stdout=${childStdout.slice(-1200)} stderr=${childStderr.slice(-1200)}`);
  }
  return true;
}

function assertOwnedApiAlive() {
  if (childError || !child || !Number.isSafeInteger(child.pid) || child.exitCode !== null || child.signalCode !== null) {
    throw new Error(`Owned API exited or failed; no existing server is a fallback. ${childError?.message ?? childStderr.slice(-1200)}`);
  }
}

async function stopOwnedApi() {
  if (!child || !Number.isSafeInteger(child.pid) || child.exitCode !== null || child.signalCode !== null) return;
  let timer;
  try {
    await new Promise((resolve, reject) => {
      child.once('exit', resolve);
      timer = setTimeout(() => reject(new Error('Owned API did not stop; retain the test environment for inspection')), 5_000);
      child.kill();
    });
  } finally { clearTimeout(timer); }
}

async function main() {
  const spawned = await ensureApi();

  const live = await safeRequest('/api/v1/health/live');
  if (!live.response?.ok || live.body?.success !== true || live.body?.data?.status !== 'ok') {
    fail(`Health live failed: ${live.response?.status ?? live.error?.message} ${JSON.stringify(live.body)}`);
  }

  const ready = await safeRequest('/api/v1/health/ready');
  if (!ready.response?.ok || ready.body?.success !== true) {
    fail(`Health ready failed: ${ready.response?.status ?? ready.error?.message} ${JSON.stringify(ready.body)}`);
  } else {
    const checks = ready.body?.data?.checks || {};
    for (const key of ['database', 'redis', 'queues']) {
      const status = checks[key]?.status;
      const allowed = process.env.NODE_ENV === 'production' ? ['ok'] : ['ok', 'disabled'];
      if (!allowed.includes(status)) fail(`Readiness dependency is not ok: ${key} (${status})`);
    }
  }

  const openApiCandidates = ['/docs-json', '/api/docs-json'];
  let openApi;
  for (const path of openApiCandidates) {
    const result = await safeRequest(path);
    if (result.response?.ok && result.body?.openapi && result.body?.paths) {
      openApi = { path, body: result.body };
      break;
    }
  }
  if (!openApi) {
    fail('OpenAPI JSON was not available at /docs-json or /api/docs-json.');
  } else if (Object.keys(openApi.body.paths).length < 50) {
    fail(`OpenAPI path count is unexpectedly low: ${Object.keys(openApi.body.paths).length}`);
  }

  const tenantBlocked = await safeRequest('/api/v1/analytics');
  const tenantMessage = JSON.stringify(tenantBlocked.body || {});
  if (tenantBlocked.response?.status !== 401 || !tenantMessage.includes('Bearer token or tenant context')) {
    fail(`Tenant enforcement sanity check failed: ${tenantBlocked.response?.status ?? tenantBlocked.error?.message} ${tenantMessage}`);
  }

  const authPublic = await safeRequest('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'nobody@example.com', password: 'wrong-password' }),
  });
  const authMessage = JSON.stringify(authPublic.body || {});
  if (authPublic.response?.status === 400 && authMessage.includes('x-tenant-id')) {
    fail('Public auth route is incorrectly blocked by tenant middleware.');
  }
  if (authPublic.response?.status !== 401) {
    fail(`Invalid public login should return 401 without crashing. Received: ${authPublic.response?.status ?? authPublic.error?.message}`);
  }

  console.log(JSON.stringify({
    status: failures.length === 0 ? 'passed' : 'failed',
    checkedAt: new Date().toISOString(),
    baseUrl,
    spawnedApi: spawned,
    readinessStatus: ready.body?.data?.status,
    openApiPath: openApi?.path,
    openApiPaths: openApi ? Object.keys(openApi.body.paths).length : 0,
    failures,
  }, null, 2));

  if (failures.length) process.exitCode = 1;
}

try {
  await main();
} finally {
  await stopOwnedApi();
}
