const apiBaseUrl = process.env.NEXORA_API_URL || process.env.API_BASE_URL || 'http://127.0.0.1:4000';
const webBaseUrl = process.env.NEXORA_WEB_URL || process.env.WEB_BASE_URL || 'http://127.0.0.1:3001';
const runId = process.env.SRC_RUN_ID || Date.now().toString(36);
const email = process.env.SRC_TEST_EMAIL || 'nexora-src-user-' + runId + '@example.com';
const password = process.env.SRC_TEST_PASSWORD || 'NexoraSRC!2026';
const companyName = process.env.SRC_TEST_COMPANY || 'NEXORA SRC Validation ' + runId;
const checks = [];

await checkApiHealth();
const auth = await checkAuthJourney();
await checkWorkspaceJourney(auth);
await checkFrontendRoutes();

const failed = checks.filter((check) => check.status !== 'passed');
console.log(JSON.stringify({ status: failed.length ? 'failed' : 'passed', apiBaseUrl, webBaseUrl, testUser: email, checks }, null, 2));
if (failed.length) process.exit(1);

async function checkApiHealth() {
  const live = await request(apiBaseUrl, '/api/v1/health/live');
  record('API live health', live.status === 200 && live.body?.success === true, live);
  const ready = await request(apiBaseUrl, '/api/v1/health/ready');
  const readyChecks = ready.body?.data?.checks ?? {};
  record('API readiness', ready.status === 200 && ready.body?.success === true && readyChecks.database?.status === 'ok' && readyChecks.redis?.status === 'ok' && readyChecks.queues?.status === 'ok', ready);
  const docs = await request(apiBaseUrl, '/docs-json');
  record('OpenAPI schema', docs.status === 200 && docs.body?.openapi && Object.keys(docs.body.paths ?? {}).length >= 1000, { status: docs.status, pathCount: Object.keys(docs.body?.paths ?? {}).length });
}

async function checkAuthJourney() {
  const signup = await request(apiBaseUrl, '/api/v1/auth/signup', { method: 'POST', body: { email, password, displayName: 'SRC Validation Owner', companyName, role: 'Founder' } });
  record('Signup and tenant bootstrap', [200, 201].includes(signup.status), signup);
  const login = await request(apiBaseUrl, '/api/v1/auth/login', { method: 'POST', body: { email, password, deviceName: 'staging-src-validator' } });
  record('Login', [200, 201].includes(login.status), login);
  const session = login.body?.data?.session ?? login.body?.session;
  const user = login.body?.data?.user ?? login.body?.user;
  const token = session?.accessToken;
  const tenantId = session?.tenantId ?? user?.tenantId;
  const organizationId = session?.organizationId ?? user?.organizationId;
  const workspaceId = session?.workspaceId ?? user?.workspaceId;
  record('Session context returned', Boolean(token && tenantId && organizationId && workspaceId), { token: Boolean(token), tenantId, organizationId, workspaceId });
  const me = await request(apiBaseUrl, '/api/v1/auth/me', { token, tenantId, workspaceId });
  record('Authenticated profile', me.status === 200 && me.body?.success === true, me);
  const forgot = await request(apiBaseUrl, '/api/v1/auth/forgot-password', { method: 'POST', body: { tenantId, email } });
  record('Password reset request', [200, 201].includes(forgot.status), forgot);
  const verification = await request(apiBaseUrl, '/api/v1/auth/email/request-verification', { method: 'POST', body: { tenantId, email } });
  record('Email verification request', [200, 201].includes(verification.status), verification);
  return { token, tenantId, organizationId, workspaceId };
}

async function checkWorkspaceJourney(auth) {
  const industries = await request(apiBaseUrl, '/api/v1/adaptive-workspace/industries', authHeaders(auth));
  record('Industry registry', industries.status === 200 && industries.body?.success === true, industries);
  const generated = await request(apiBaseUrl, '/api/v1/adaptive-workspace/generate-workspace', {
    method: 'POST',
    ...authHeaders(auth),
    body: {
      organizationId: auth.organizationId,
      workspaceName: companyName + ' Workspace',
      workspaceSlug: 'src-' + runId,
      profile: {
        industry: 'saas',
        businessType: 'startup',
        teamSize: '11_50',
        revenueRange: '1m_10m',
        growthStage: 'growth',
        country: 'US',
        goals: ['validate_staging', 'generate_dashboard', 'activate_ai_copilot'],
        role: 'Founder',
        metadata: { source: 'phase9-src-e2e' },
      },
    },
  });
  record('Workspace blueprint generation', [200, 201].includes(generated.status), generated);
  const blueprintId = generated.body?.data?.id ?? generated.body?.id;
  const dashboard = await request(apiBaseUrl, '/api/v1/adaptive-workspace/dashboard-blueprint?blueprintId=' + encodeURIComponent(blueprintId ?? ''), authHeaders(auth));
  record('Dashboard blueprint retrieval', dashboard.status === 200 && dashboard.body?.success === true, dashboard);
}

async function checkFrontendRoutes() {
  for (const route of ['/', '/auth/signup', '/auth/login', '/auth/forgot-password', '/auth/verify-email', '/onboarding', '/workspace-launcher', '/command-center', '/settings', '/ai-agents/copilot']) {
    const result = await request(webBaseUrl, route);
    record('Frontend route ' + route, result.status === 200, { status: result.status });
  }
}

function authHeaders(auth) {
  return { token: auth.token, tenantId: auth.tenantId, workspaceId: auth.workspaceId };
}

async function request(baseUrl, route, options = {}) {
  try {
    const response = await fetch(baseUrl + route, {
      method: options.method ?? 'GET',
      headers: {
        ...(options.body ? { 'content-type': 'application/json' } : {}),
        ...(options.token ? { authorization: 'Bearer ' + options.token } : {}),
        ...(options.tenantId ? { 'x-tenant-id': options.tenantId } : {}),
        ...(options.workspaceId ? { 'x-workspace-id': options.workspaceId } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const text = await response.text();
    let body;
    try { body = text ? JSON.parse(text) : undefined; } catch { body = text; }
    return { status: response.status, ok: response.ok, body };
  } catch (error) {
    return { status: 0, ok: false, body: { error: error.message } };
  }
}

function record(name, passed, evidence) {
  checks.push({ name, status: passed ? 'passed' : 'failed', evidence: summarize(evidence) });
}

function summarize(value) {
  if (!value) return value;
  const json = JSON.stringify(value);
  if (json.length <= 900) return value;
  return { truncated: true, preview: json.slice(0, 900) };
}
