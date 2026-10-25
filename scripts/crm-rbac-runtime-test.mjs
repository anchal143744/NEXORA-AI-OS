import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { randomUUID } from 'node:crypto';
import { json, urlencoded } from 'express';
import { assertDisposableRuntimeDatabase, createRuntimeFixtureProvisioner } from './test-fixtures/runtime-membership.mjs';

const runId = process.env.CRM_RBAC_RUN_ID || Date.now().toString(36);
const password = process.env.CRM_RBAC_PASSWORD || 'NexoraRBAC!2026';
const failures = [];
const matrix = [];
let TokenServiceClass;
let SessionsServiceClass;
let runtimeFixtures;

const permissionProfiles = {
  ADMIN: ['create', 'read', 'update', 'delete', 'manage', 'approve', 'execute'],
  MANAGER: ['create', 'read', 'update', 'approve', 'execute'],
  MEMBER: ['create', 'read', 'update'],
  NO_REQUIRED_PERMISSION: [],
};

function fail(message) {
  failures.push(message);
}

async function createApp() {
  assertDisposableRuntimeDatabase();
  const [{ AppModule }, { GlobalExceptionFilter }, { ApiResponseInterceptor }, tokenModule, sessionsModule, prismaModule, passwordModule] = await Promise.all([
    import('../apps/api/dist/app.module.js'),
    import('../apps/api/dist/common/filters/global-exception.filter.js'),
    import('../apps/api/dist/common/interceptors/api-response.interceptor.js'),
    import('../apps/api/dist/modules/auth/tokens/token.service.js'),
    import('../apps/api/dist/modules/sessions/sessions.service.js'),
    import('../apps/api/dist/infrastructure/database/prisma.service.js'),
    import('../apps/api/dist/modules/security/services/password.service.js'),
  ]);
  TokenServiceClass = tokenModule.TokenService;
  SessionsServiceClass = sessionsModule.SessionsService;
  const app = await NestFactory.create(AppModule, { logger: false });
  app.use(json({ limit: process.env.API_PAYLOAD_LIMIT ?? '1mb' }));
  app.use(urlencoded({ extended: true, limit: process.env.API_PAYLOAD_LIMIT ?? '1mb' }));
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  await app.listen(0, '127.0.0.1');
  const passwordService = app.get(passwordModule.PasswordService, { strict: false });
  runtimeFixtures = createRuntimeFixtureProvisioner({
    prisma: app.get(prismaModule.PrismaService, { strict: false }),
    hashPassword: value => passwordService.hash(value),
    runId,
  });
  await runtimeFixtures.verifyDatabase();
  const address = app.getHttpServer().address();
  const port = typeof address === 'object' && address ? address.port : 0;
  return { app, baseUrl: `http://127.0.0.1:${port}` };
}

async function request(baseUrl, pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
      ...(options.tenantId ? { 'x-tenant-id': options.tenantId } : {}),
      ...(options.workspaceId ? { 'x-workspace-id': options.workspaceId } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    body = text;
  }
  return { status: response.status, ok: response.ok, body };
}

async function safeRequest(baseUrl, pathname, options = {}) {
  try {
    return await request(baseUrl, pathname, options);
  } catch (error) {
    return { status: 0, ok: false, body: { error: error.message } };
  }
}

function unwrap(body) {
  return body?.data ?? body;
}

async function signupUser(baseUrl, input) {
  if (input.tenantId || input.workspaceId) {
    const fixtureUser = await runtimeFixtures.provisionMember({ ...input, password });
    const login = await request(baseUrl, '/api/v1/auth/login', {
      method: 'POST',
      body: { email: input.email, password, tenantId: input.tenantId },
    });
    if (![200, 201].includes(login.status)) throw new Error(`Fixture login failed: ${login.status} ${JSON.stringify(login.body)}`);
    const data = unwrap(login.body);
    const principal = { user: data.user, session: data.session };
    runtimeFixtures.assertMemberLogin(principal, input, fixtureUser);
    return principal;
  }
  const signup = await request(baseUrl, '/api/v1/auth/signup', {
    method: 'POST',
    body: {
      email: input.email,
      password,
      displayName: input.displayName,
      companyName: input.companyName,
      role: input.role,
    },
  });
  if (![200, 201].includes(signup.status)) {
    throw new Error(`Signup failed for ${input.email}: ${signup.status} ${JSON.stringify(signup.body)}`);
  }
  const data = unwrap(signup.body);
  const principal = { user: data.user, session: data.session };
  await runtimeFixtures.registerOwner(principal);
  return principal;
}

async function issueRoleToken(app, principal, role, workspaceId = principal.session.workspaceId) {
  const tokenService = app.get(TokenServiceClass, { strict: false });
  const sessionsService = app.get(SessionsServiceClass, { strict: false });
  const sessionId = randomUUID();
  const tokenPair = await tokenService.issueTokenPair({
    sub: principal.user.id,
    userId: principal.user.id,
    tenantId: principal.session.tenantId,
    organizationId: principal.session.organizationId,
    workspaceId,
    sessionId,
    role,
    roles: [role],
    permissions: permissionProfiles[role],
  });
  await sessionsService.createSession({
    tenantId: principal.session.tenantId,
    userId: principal.user.id,
    sessionId,
    refreshToken: tokenPair.refreshToken,
    device: { deviceName: 'crm-rbac-runtime-test' },
  });
  return {
    role,
    token: tokenPair.accessToken,
    tenantId: principal.session.tenantId,
    organizationId: principal.session.organizationId,
    workspaceId,
  };
}

function authOptions(auth, options = {}) {
  return {
    ...options,
    token: auth.token,
    tenantId: auth.tenantId,
    workspaceId: auth.workspaceId,
  };
}

async function expectOperation(baseUrl, role, operation, expected, pathname, options = {}) {
  const result = await safeRequest(baseUrl, pathname, options);
  const actual = result.status;
  const passed = actual === expected;
  matrix.push({ role, operation, endpoint: `${options.method ?? 'GET'} ${pathname}`, expected, actual, result: passed ? 'PASS' : 'FAIL' });
  if (!passed) fail(`${role} ${operation} expected ${expected}, received ${actual}: ${JSON.stringify(result.body)}`);
  return result;
}

function leadPayload(label) {
  return {
    firstName: 'RBAC',
    lastName: label,
    email: `crm-rbac-${label.toLowerCase()}-${runId}@example.com`,
    company: `RBAC ${label} Account ${runId}`,
    source: 'runtime-rbac-fixture',
    status: 'new',
    score: 72,
    estimatedValue: 24000,
    tags: ['rbac', label.toLowerCase()],
  };
}

function customerPayload(label) {
  return {
    name: `RBAC ${label} Customer ${runId}`,
    email: `crm-rbac-customer-${label.toLowerCase()}-${runId}@example.com`,
    company: `RBAC ${label} Account ${runId}`,
    lifecycleStage: 'customer',
    healthScore: 84,
    annualRevenue: 120000,
    tags: ['rbac'],
  };
}

function opportunityPayload(label, customerId) {
  return {
    name: `RBAC ${label} Opportunity ${runId}`,
    customerId,
    stage: 'proposal',
    amount: 64000,
    currency: 'USD',
    expectedCloseDate: '2026-12-31T00:00:00.000Z',
    probability: 68,
    risk: 'medium',
    nextStep: 'Validate RBAC close plan.',
  };
}

async function createCrmSeed(baseUrl, auth, label) {
  const lead = unwrap((await request(baseUrl, '/api/v1/crm/leads', authOptions(auth, { method: 'POST', body: leadPayload(label) }))).body);
  const customer = unwrap((await request(baseUrl, '/api/v1/crm/customers', authOptions(auth, { method: 'POST', body: customerPayload(label) }))).body);
  const opportunity = unwrap((await request(baseUrl, '/api/v1/crm/opportunities', authOptions(auth, { method: 'POST', body: opportunityPayload(label, customer.id) }))).body);
  return { lead, customer, opportunity, proposalId: `proposal-${opportunity.id}` };
}

async function createWorkspace(baseUrl, auth, organizationId) {
  const response = await request(baseUrl, '/api/v1/workspaces', authOptions(auth, {
    method: 'POST',
    body: {
      organizationId,
      name: `CRM RBAC Secondary Workspace ${runId}`,
      slug: `crm-rbac-secondary-${runId}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      description: 'Secondary workspace for CRM RBAC isolation validation.',
    },
  }));
  if (![200, 201].includes(response.status)) {
    throw new Error(`Secondary workspace creation failed: ${response.status} ${JSON.stringify(response.body)}`);
  }
  return unwrap(response.body);
}

async function main() {
  const { app, baseUrl } = await createApp();
  try {
    const companyName = `NEXORA CRM RBAC Validation ${runId}`;
    const admin = await signupUser(baseUrl, {
      email: `crm-rbac-admin-${runId}@example.com`,
      displayName: 'CRM RBAC Admin',
      companyName,
      role: 'ADMIN',
    });
    const manager = await signupUser(baseUrl, {
      email: `crm-rbac-manager-${runId}@example.com`,
      displayName: 'CRM RBAC Manager',
      tenantId: admin.session.tenantId,
      workspaceId: admin.session.workspaceId,
      role: 'MANAGER',
    });
    const member = await signupUser(baseUrl, {
      email: `crm-rbac-member-${runId}@example.com`,
      displayName: 'CRM RBAC Member',
      tenantId: admin.session.tenantId,
      workspaceId: admin.session.workspaceId,
      role: 'MEMBER',
    });
    const noPermission = await signupUser(baseUrl, {
      email: `crm-rbac-no-permission-${runId}@example.com`,
      displayName: 'CRM RBAC No Permission',
      tenantId: admin.session.tenantId,
      workspaceId: admin.session.workspaceId,
      role: 'NO_REQUIRED_PERMISSION',
    });

    const adminAuth = await issueRoleToken(app, admin, 'ADMIN');
    const managerAuth = await issueRoleToken(app, manager, 'MANAGER');
    const memberAuth = await issueRoleToken(app, member, 'MEMBER');
    const noPermissionAuth = await issueRoleToken(app, noPermission, 'NO_REQUIRED_PERMISSION');

    const adminLead = unwrap((await expectOperation(baseUrl, 'ADMIN', 'Create lead', 201, '/api/v1/crm/leads', authOptions(adminAuth, { method: 'POST', body: leadPayload('Admin') }))).body);
    await expectOperation(baseUrl, 'ADMIN', 'Read workspace', 200, '/api/v1/crm/workspace', authOptions(adminAuth));
    await expectOperation(baseUrl, 'ADMIN', 'Update lead', 200, `/api/v1/crm/leads/${adminLead.id}`, authOptions(adminAuth, { method: 'PATCH', body: { status: 'qualified', score: 89 } }));
    await expectOperation(baseUrl, 'ADMIN', 'Delete lead', 200, `/api/v1/crm/leads/${adminLead.id}`, authOptions(adminAuth, { method: 'DELETE' }));
    const adminSeed = await createCrmSeed(baseUrl, adminAuth, 'AdminProposal');
    await expectOperation(baseUrl, 'ADMIN', 'AI Sales Copilot', 201, '/api/v1/crm/ai-sales-copilot', authOptions(adminAuth, { method: 'POST', body: { command: 'Show hot leads' } }));
    await expectOperation(baseUrl, 'ADMIN', 'Approve proposal', 201, `/api/v1/crm/proposals/${adminSeed.proposalId}/approval`, authOptions(adminAuth, { method: 'POST' }));

    const managerLead = unwrap((await expectOperation(baseUrl, 'MANAGER', 'Create lead', 201, '/api/v1/crm/leads', authOptions(managerAuth, { method: 'POST', body: leadPayload('Manager') }))).body);
    await expectOperation(baseUrl, 'MANAGER', 'Read workspace', 200, '/api/v1/crm/workspace', authOptions(managerAuth));
    await expectOperation(baseUrl, 'MANAGER', 'Update lead', 200, `/api/v1/crm/leads/${managerLead.id}`, authOptions(managerAuth, { method: 'PATCH', body: { status: 'assigned', score: 77 } }));
    await expectOperation(baseUrl, 'MANAGER', 'Delete lead denied', 403, `/api/v1/crm/leads/${managerLead.id}`, authOptions(managerAuth, { method: 'DELETE' }));
    await expectOperation(baseUrl, 'MANAGER', 'AI Sales Copilot', 201, '/api/v1/crm/ai-sales-copilot', authOptions(managerAuth, { method: 'POST', body: { command: 'Show pipeline health' } }));

    const memberLead = unwrap((await expectOperation(baseUrl, 'MEMBER', 'Create lead', 201, '/api/v1/crm/leads', authOptions(memberAuth, { method: 'POST', body: leadPayload('Member') }))).body);
    await expectOperation(baseUrl, 'MEMBER', 'Read workspace', 200, '/api/v1/crm/workspace', authOptions(memberAuth));
    await expectOperation(baseUrl, 'MEMBER', 'Update lead', 200, `/api/v1/crm/leads/${memberLead.id}`, authOptions(memberAuth, { method: 'PATCH', body: { status: 'nurture', score: 61 } }));
    await expectOperation(baseUrl, 'MEMBER', 'Delete lead denied', 403, `/api/v1/crm/leads/${memberLead.id}`, authOptions(memberAuth, { method: 'DELETE' }));
    await expectOperation(baseUrl, 'MEMBER', 'AI Sales Copilot denied', 403, '/api/v1/crm/ai-sales-copilot', authOptions(memberAuth, { method: 'POST', body: { command: 'Show hot leads' } }));

    await expectOperation(baseUrl, 'NO_REQUIRED_PERMISSION', 'Read workspace denied', 403, '/api/v1/crm/workspace', authOptions(noPermissionAuth));
    await expectOperation(baseUrl, 'NO_REQUIRED_PERMISSION', 'Create lead denied', 403, '/api/v1/crm/leads', authOptions(noPermissionAuth, { method: 'POST', body: leadPayload('NoPermission') }));
    await expectOperation(baseUrl, 'UNAUTHENTICATED', 'Read workspace denied', 401, '/api/v1/crm/workspace');
    await expectOperation(baseUrl, 'PUBLIC', 'Join existing tenant without invitation denied', 401, '/api/v1/auth/signup', {
      method: 'POST',
      body: { email: `crm-rbac-direct-tenant-${runId}@example.com`, password, displayName: 'CRM RBAC Direct Tenant Join', tenantId: admin.session.tenantId },
    });
    await expectOperation(baseUrl, 'PUBLIC', 'Join existing workspace without invitation denied', 401, '/api/v1/auth/signup', {
      method: 'POST',
      body: { email: `crm-rbac-direct-workspace-${runId}@example.com`, password, displayName: 'CRM RBAC Direct Workspace Join', workspaceId: admin.session.workspaceId },
    });

    const workspaceB = await createWorkspace(baseUrl, adminAuth, admin.session.organizationId);
    const workspaceBUser = await signupUser(baseUrl, {
      email: `crm-rbac-workspace-b-${runId}@example.com`,
      displayName: 'CRM RBAC Workspace B Admin',
      tenantId: admin.session.tenantId,
      workspaceId: workspaceB.id,
      role: 'ADMIN',
    });
    const workspaceBAuth = await issueRoleToken(app, workspaceBUser, 'ADMIN', workspaceB.id);
    const workspaceBSeed = await createCrmSeed(baseUrl, workspaceBAuth, 'WorkspaceB');
    await expectOperation(baseUrl, 'ADMIN', 'Cannot update another workspace lead', 404, `/api/v1/crm/leads/${workspaceBSeed.lead.id}`, authOptions(adminAuth, { method: 'PATCH', body: { status: 'qualified' } }));
    await expectOperation(baseUrl, 'ADMIN', 'Cannot access another workspace via spoofed header', 403, `/api/v1/crm/leads/${workspaceBSeed.lead.id}`, {
      method: 'PATCH',
      token: adminAuth.token,
      tenantId: adminAuth.tenantId,
      workspaceId: workspaceB.id,
      body: { status: 'qualified' },
    });

    const orgBAdmin = await signupUser(baseUrl, {
      email: `crm-rbac-org-b-admin-${runId}@example.com`,
      displayName: 'CRM RBAC Org B Admin',
      companyName: `${companyName} B`,
      role: 'ADMIN',
    });
    const orgBAuth = await issueRoleToken(app, orgBAdmin, 'ADMIN');
    const orgBSeed = await createCrmSeed(baseUrl, orgBAuth, 'OrgB');
    await expectOperation(baseUrl, 'ADMIN', 'Cannot update another organization lead', 404, `/api/v1/crm/leads/${orgBSeed.lead.id}`, authOptions(adminAuth, { method: 'PATCH', body: { status: 'qualified' } }));
    const ai = await expectOperation(baseUrl, 'ADMIN', 'AI context excludes other organization', 201, '/api/v1/crm/ai-sales-copilot', authOptions(adminAuth, { method: 'POST', body: { command: 'Show hot leads' } }));
    const aiText = JSON.stringify(ai.body);
    if (aiText.includes(`RBAC OrgB Account ${runId}`) || aiText.includes(`OrgB Opportunity ${runId}`)) {
      fail('AI Sales Copilot response included another organization CRM context.');
      const row = matrix.find((item) => item.operation === 'AI context excludes other organization');
      if (row) row.result = 'FAIL';
    }

    console.log(JSON.stringify({
      status: failures.length === 0 ? 'passed' : 'failed',
      checkedAt: new Date().toISOString(),
      baseUrl,
      runId,
      matrix,
      failures,
    }, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await app.close();
  }
}

await main();
