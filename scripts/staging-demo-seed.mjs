import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('C:/Users/Acer/OneDrive/Desktop/NEXORA_AI');
const fixturePath = path.join(root, 'ops/staging/staging-demo-data.json');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
const apply = process.argv.includes('--apply') || process.env.STAGING_SEED_APPLY === 'true';
const apiBaseUrl = process.env.NEXORA_API_URL || process.env.API_BASE_URL || 'http://127.0.0.1:4000';
const password = process.env.STAGING_SEED_PASSWORD || 'NexoraSRC!2026';
const runId = process.env.STAGING_SEED_RUN_ID || 'src1';

validateFixture(fixture);

const applied = [];
if (apply) {
  for (const organization of fixture.organizations) {
    const email = organization.owner.email.replace('@', '+' + runId + '@');
    const signupPayload = {
      email,
      password,
      displayName: organization.owner.name,
      companyName: organization.name,
      role: organization.owner.role,
    };

    const signup = await request('/api/v1/auth/signup', { method: 'POST', body: signupPayload });
    if (![200, 201, 409].includes(signup.status)) {
      throw new Error('Staging signup failed for ' + organization.key + ': HTTP ' + signup.status + ' ' + JSON.stringify(signup.body));
    }

    const login = await request('/api/v1/auth/login', { method: 'POST', body: { email, password, deviceName: 'src-seed-runner' } });
    if (![200, 201].includes(login.status)) {
      throw new Error('Staging login failed for ' + organization.key + ': HTTP ' + login.status + ' ' + JSON.stringify(login.body));
    }

    const session = login.body?.data?.session ?? login.body?.session;
    const user = login.body?.data?.user ?? login.body?.user;
    const token = session?.accessToken;
    const tenantId = session?.tenantId ?? user?.tenantId;
    const organizationId = session?.organizationId ?? user?.organizationId;
    const workspaceId = session?.workspaceId ?? user?.workspaceId;
    if (!token || !tenantId || !organizationId || !workspaceId) {
      throw new Error('Staging seed login did not return tenant, organization, workspace and token for ' + organization.key);
    }

    const blueprint = await request('/api/v1/adaptive-workspace/generate-workspace', {
      method: 'POST',
      token,
      tenantId,
      workspaceId,
      body: {
        organizationId,
        workspaceName: organization.name + ' SRC Workspace',
        workspaceSlug: organization.key + '-src-' + runId,
        profile: {
          industry: organization.profile.industry,
          businessType: organization.profile.businessType,
          teamSize: organization.profile.teamSize,
          revenueRange: organization.profile.revenueRange,
          growthStage: organization.profile.growthStage,
          country: organization.profile.country,
          goals: organization.goals,
          role: organization.owner.role,
          metadata: { source: 'staging-src-seed', currency: organization.profile.currency, timezone: organization.profile.timezone },
        },
      },
    });
    if (![200, 201].includes(blueprint.status)) {
      throw new Error('Workspace blueprint generation failed for ' + organization.key + ': HTTP ' + blueprint.status + ' ' + JSON.stringify(blueprint.body));
    }

    applied.push({ key: organization.key, email, tenantId, organizationId, workspaceId, blueprintId: blueprint.body?.data?.id ?? blueprint.body?.id ?? null });
  }
}

console.log(JSON.stringify({
  status: 'passed',
  mode: apply ? 'applied_to_backend' : 'fixture_validated',
  organizations: fixture.organizations.length,
  industries: fixture.industries,
  apiBaseUrl: apply ? apiBaseUrl : undefined,
  applied,
}, null, 2));

function validateFixture(data) {
  if (data.version !== '1.9.0-src.1') throw new Error('Staging fixture version mismatch.');
  if (!Array.isArray(data.organizations) || data.organizations.length < 5) throw new Error('Staging fixture must include at least five organizations.');
  for (const industry of ['saas', 'retail', 'manufacturing', 'healthcare', 'agency']) {
    if (!data.organizations.some((organization) => organization.profile?.industry === industry)) throw new Error('Missing staging industry coverage: ' + industry);
  }
  for (const organization of data.organizations) {
    for (const field of ['key', 'name', 'owner', 'profile', 'goals', 'modules', 'kpis', 'sampleRecords']) {
      if (!organization[field]) throw new Error('Missing ' + field + ' for ' + (organization.key ?? 'unknown organization'));
    }
    if (!organization.owner.email.includes('@')) throw new Error('Invalid seed owner email for ' + organization.key);
    if (!organization.modules.length || !organization.kpis.length) throw new Error('Seed organization lacks module or KPI coverage: ' + organization.key);
  }
}

async function request(route, options = {}) {
  const response = await fetch(apiBaseUrl + route, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(options.token ? { authorization: 'Bearer ' + options.token } : {}),
      ...(options.tenantId ? { 'x-tenant-id': options.tenantId } : {}),
      ...(options.workspaceId ? { 'x-workspace-id': options.workspaceId } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  let body;
  try { body = text ? JSON.parse(text) : undefined; } catch { body = text; }
  return { status: response.status, ok: response.ok, body };
}
