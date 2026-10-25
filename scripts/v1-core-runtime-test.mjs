import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { randomUUID } from 'node:crypto';
import { json, urlencoded } from 'express';

const runId = process.env.V1_CORE_RUN_ID || Date.now().toString(36);
const password = process.env.V1_CORE_PASSWORD || 'NexoraV1Runtime!2026';
const failures = [];
const matrix = [];
const persistence = [];
const observations = [];

let TokenServiceClass;
let PrismaServiceClass;
let SessionsServiceClass;

const permissionProfiles = {
  ADMIN: ['create', 'read', 'update', 'delete', 'manage', 'approve', 'execute'],
  MANAGER: ['create', 'read', 'update', 'approve', 'execute'],
  MEMBER: ['create', 'read', 'update'],
  NO_REQUIRED_PERMISSION: [],
};

function fail(message) {
  failures.push(message);
}

function recordPersistence(module, entity, expected, actual, passed, detail = '') {
  persistence.push({ module, entity, expected, actual, result: passed ? 'PASS' : 'FAIL', detail });
  if (!passed) fail(`${module} ${entity} persistence failed: ${detail || `${actual} !== ${expected}`}`);
}

async function createApp() {
  const [{ AppModule }, { GlobalExceptionFilter }, { ApiResponseInterceptor }, tokenModule, prismaModule, sessionsModule] = await Promise.all([
    import('../apps/api/dist/app.module.js'),
    import('../apps/api/dist/common/filters/global-exception.filter.js'),
    import('../apps/api/dist/common/interceptors/api-response.interceptor.js'),
    import('../apps/api/dist/modules/auth/tokens/token.service.js'),
    import('../apps/api/dist/infrastructure/database/prisma.service.js'),
    import('../apps/api/dist/modules/sessions/sessions.service.js'),
  ]);
  TokenServiceClass = tokenModule.TokenService;
  PrismaServiceClass = prismaModule.PrismaService;
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

async function expectStatus(baseUrl, module, role, operation, expected, pathname, options = {}) {
  const result = await safeRequest(baseUrl, pathname, options);
  const actual = result.status;
  const passed = Array.isArray(expected) ? expected.includes(actual) : actual === expected;
  matrix.push({
    module,
    role,
    operation,
    endpoint: `${options.method ?? 'GET'} ${pathname}`,
    expected: Array.isArray(expected) ? expected.join('/') : expected,
    actual,
    result: passed ? 'PASS' : 'FAIL',
  });
  if (!passed) fail(`${module} ${role} ${operation} expected ${Array.isArray(expected) ? expected.join('/') : expected}, received ${actual}: ${JSON.stringify(result.body)}`);
  return result;
}

function decodeAccessToken(token) {
  const payload = token.split('.')[1];
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
}

async function issueExpiredAccessToken(principal) {
  const { JwtService } = await import('@nestjs/jwt');
  const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
  return jwtService.signAsync({
    sub: principal.user.id,
    userId: principal.user.id,
    tenantId: principal.session.tenantId,
    organizationId: principal.session.organizationId,
    workspaceId: principal.session.workspaceId,
    sessionId: principal.session.id,
    role: 'ADMIN',
    roles: ['ADMIN'],
    permissions: permissionProfiles.ADMIN,
  }, { expiresIn: '-1s' });
}

function authOptions(auth, options = {}) {
  return { ...options, token: auth.token };
}

async function signupUser(baseUrl, input) {
  const response = await request(baseUrl, '/api/v1/auth/signup', {
    method: 'POST',
    body: {
      email: input.email,
      password,
      displayName: input.displayName,
      companyName: input.companyName,
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      role: input.role,
    },
  });
  if (![200, 201].includes(response.status)) {
    throw new Error(`Signup failed for ${input.email}: ${response.status} ${JSON.stringify(response.body)}`);
  }
  const data = unwrap(response.body);
  return { user: data.user, session: data.session, verificationRequired: data.verificationRequired };
}

async function loginUser(baseUrl, email, tenantId) {
  const response = await request(baseUrl, '/api/v1/auth/login', {
    method: 'POST',
    body: { email, password, tenantId },
  });
  if (![200, 201].includes(response.status)) {
    throw new Error(`Login failed for ${email}: ${response.status} ${JSON.stringify(response.body)}`);
  }
  const data = unwrap(response.body);
  return { user: data.user, session: data.session };
}

async function issueRoleToken(app, principal, role, workspaceId = principal.session.workspaceId) {
  const tokenService = app.get(TokenServiceClass, { strict: false });
  const sessionsService = app.get(SessionsServiceClass, { strict: false });
  const prisma = app.get(PrismaServiceClass, { strict: false });
  const workspace = workspaceId
    ? await prisma.workspace.findFirst({ where: { tenantId: principal.session.tenantId, id: workspaceId, deletedAt: null }, select: { organizationId: true } })
    : null;
  const organizationId = workspace?.organizationId ?? principal.session.organizationId;
  const sessionId = randomUUID();
  const tokenPair = await tokenService.issueTokenPair({
    sub: principal.user.id,
    userId: principal.user.id,
    tenantId: principal.session.tenantId,
    organizationId,
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
    device: { deviceName: 'v1-core-runtime-test' },
  });
  return {
    role,
    token: tokenPair.accessToken,
    tenantId: principal.session.tenantId,
    organizationId,
    workspaceId,
  };
}

async function ensureBillingAccount(prisma, principal, label) {
  return prisma.billingAccount.upsert({
    where: {
      tenantId_organizationId: {
        tenantId: principal.session.tenantId,
        organizationId: principal.session.organizationId,
      },
    },
    update: {
      billingEmail: `billing-${label}-${runId}@example.com`,
      currency: 'USD',
    },
    create: {
      tenantId: principal.session.tenantId,
      organizationId: principal.session.organizationId,
      billingEmail: `billing-${label}-${runId}@example.com`,
      currency: 'USD',
      billingAddress: { source: 'v1-runtime-test' },
    },
  });
}

async function ensureCurrency(prisma, code = 'USD') {
  return prisma.currency.upsert({
    where: { code },
    update: { enabled: true, deletedAt: null },
    create: {
      code,
      name: 'US Dollar',
      symbol: '$',
      precision: 2,
      enabled: true,
      metadata: { source: 'v1-runtime-test-fixture' },
    },
  });
}

async function createSecondaryWorkspace(baseUrl, auth, label) {
  const response = await expectStatus(baseUrl, 'Workspace', auth.role, `Create secondary workspace ${label}`, 201, '/api/v1/workspaces', authOptions(auth, {
    method: 'POST',
    body: {
      organizationId: auth.organizationId,
      name: `V1 Runtime ${label} Workspace ${runId}`,
      slug: `v1-runtime-${label}-${runId}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      description: 'Workspace isolation fixture for V1 runtime verification.',
    },
  }));
  return unwrap(response.body);
}

function invoicePayload(billingAccountId, label) {
  return {
    billingAccountId,
    invoiceNumber: `V1-${label}-${runId}`.toUpperCase(),
    currency: 'USD',
    subtotal: 1200,
    tax: 120,
    total: 1320,
    dueAt: '2026-12-31T00:00:00.000Z',
  };
}

function expensePayload(label) {
  return {
    category: `Runtime ${label}`,
    vendor: `Vendor ${label}`,
    description: `V1 runtime expense ${label}`,
    amount: 245,
    currency: 'USD',
    incurredAt: '2026-08-21T00:00:00.000Z',
  };
}

function employeePayload(label) {
  return {
    employeeNumber: `EMP-${label}-${runId}`.toUpperCase(),
    department: `People ${label}`,
    jobTitle: 'Runtime Analyst',
    startDate: '2026-08-21T00:00:00.000Z',
  };
}

function projectPayload(label) {
  return {
    name: `V1 ${label} Project ${runId}`,
    startDate: '2026-08-21T00:00:00.000Z',
    dueDate: '2026-12-31T00:00:00.000Z',
  };
}

function leadPayload(label) {
  return {
    firstName: 'V1',
    lastName: `Analytics ${label}`,
    email: `v1-analytics-${label.toLowerCase()}-${runId}@example.com`,
    company: `V1 ${label} Customer ${runId}`,
    source: 'v1-runtime',
    status: 'qualified',
    score: 82,
    conversionProbability: 68,
    estimatedValue: 42000,
    tags: ['v1-runtime', label.toLowerCase()],
  };
}

function customerPayload(label) {
  return {
    name: `V1 ${label} Customer ${runId}`,
    email: `v1-customer-${label.toLowerCase()}-${runId}@example.com`,
    company: `V1 ${label} Customer ${runId}`,
    lifecycleStage: 'customer',
    healthScore: 86,
    annualRevenue: 180000,
    tags: ['v1-runtime'],
  };
}

function opportunityPayload(label, customerId) {
  return {
    name: `V1 ${label} Opportunity ${runId}`,
    customerId,
    stage: 'proposal',
    amount: 50000,
    currency: 'USD',
    expectedCloseDate: '2026-12-31T00:00:00.000Z',
    probability: 70,
    risk: 'medium',
    nextStep: 'Complete V1 analytics validation.',
  };
}

async function verifyFinance(baseUrl, prisma, auths, fixtures) {
  const { adminA, managerA, memberA, noPermissionA, adminA2, adminB } = auths;
  const { billingA, billingB } = fixtures;

  await expectStatus(baseUrl, 'Finance', 'UNAUTHENTICATED', 'Read workspace denied', 401, '/api/v1/finance/workspace');
  await expectStatus(baseUrl, 'Finance', 'NO_REQUIRED_PERMISSION', 'Read workspace denied', 403, '/api/v1/finance/workspace', authOptions(noPermissionA));
  await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Read workspace', 200, '/api/v1/finance/workspace', authOptions(adminA));
  await expectStatus(baseUrl, 'Finance', 'ADMIN', 'List invoices', 200, '/api/v1/finance/invoices', authOptions(adminA));
  await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Invalid invoice input rejected', 400, '/api/v1/finance/invoices', authOptions(adminA, { method: 'POST', body: { billingAccountId: 'bad-id' } }));

  const invoice = unwrap((await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Create invoice', 201, '/api/v1/finance/invoices', authOptions(adminA, { method: 'POST', body: invoicePayload(billingA.id, 'A') }))).body);
  const invoiceDb = await prisma.invoice.findFirst({ where: { id: invoice.id, tenantId: adminA.tenantId, workspaceId: adminA.workspaceId, deletedAt: null } });
  recordPersistence('Finance', 'Invoice create', invoice.id, invoiceDb?.id, invoiceDb?.id === invoice.id, 'invoice exists in scoped database query');
  await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Read invoice status', 200, `/api/v1/finance/invoices/${invoice.id}/status`, authOptions(adminA));
  await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Update invoice', 200, `/api/v1/finance/invoices/${invoice.id}`, authOptions(adminA, { method: 'PATCH', body: { status: 'sent', total: 1500 } }));
  await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Mark invoice paid', 201, `/api/v1/finance/invoices/${invoice.id}/mark-paid`, authOptions(adminA, { method: 'POST' }));
  const invoiceStatus = unwrap((await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Read invoice after refresh-style request', 200, `/api/v1/finance/invoices/${invoice.id}/status`, authOptions(adminA))).body);
  recordPersistence('Finance', 'Invoice refresh read', invoice.id, invoiceStatus?.id, invoiceStatus?.id === invoice.id, 'invoice can be read after repeated request');

  const expense = unwrap((await expectStatus(baseUrl, 'Finance', 'MANAGER', 'Create expense', 201, '/api/v1/finance/expenses', authOptions(managerA, { method: 'POST', body: expensePayload('A') }))).body);
  const expenseDb = await prisma.financeExpense.findFirst({ where: { id: expense.id, tenantId: adminA.tenantId, workspaceId: adminA.workspaceId, deletedAt: null } });
  recordPersistence('Finance', 'Expense create', expense.id, expenseDb?.id, expenseDb?.id === expense.id, 'expense exists in scoped database query');
  await expectStatus(baseUrl, 'Finance', 'MEMBER', 'Update expense', 200, `/api/v1/finance/expenses/${expense.id}`, authOptions(memberA, { method: 'PATCH', body: { description: 'Updated by member runtime test' } }));
  await expectStatus(baseUrl, 'Finance', 'MEMBER', 'Approve expense denied', 403, `/api/v1/finance/expenses/${expense.id}/approve`, authOptions(memberA, { method: 'POST' }));
  await expectStatus(baseUrl, 'Finance', 'MANAGER', 'Approve expense', 201, `/api/v1/finance/expenses/${expense.id}/approve`, authOptions(managerA, { method: 'POST' }));
  await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Revenue summary', 200, '/api/v1/finance/revenue/summary', authOptions(adminA));
  await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Finance copilot', 201, '/api/v1/finance/ai-finance-copilot', authOptions(adminA, { method: 'POST', body: { command: 'Show finance summary' } }));
  await expectStatus(baseUrl, 'Finance', 'MEMBER', 'Finance copilot denied', 403, '/api/v1/finance/ai-finance-copilot', authOptions(memberA, { method: 'POST', body: { command: 'Show finance summary' } }));

  const a2Expense = unwrap((await expectStatus(baseUrl, 'Finance', 'ADMIN_A2', 'Create workspace A2 expense', 201, '/api/v1/finance/expenses', authOptions(adminA2, { method: 'POST', body: expensePayload('A2') }))).body);
  const bExpense = unwrap((await expectStatus(baseUrl, 'Finance', 'ADMIN_B', 'Create organization B expense', 201, '/api/v1/finance/expenses', authOptions(adminB, { method: 'POST', body: expensePayload('B') }))).body);
  await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Cannot update workspace A2 expense', 404, `/api/v1/finance/expenses/${a2Expense.id}`, authOptions(adminA, { method: 'PATCH', body: { description: 'blocked' } }));
  await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Cannot update workspace A2 expense with spoofed header', 404, `/api/v1/finance/expenses/${a2Expense.id}`, authOptions(adminA, { method: 'PATCH', body: { description: 'blocked' }, headers: { 'x-workspace-id': adminA2.workspaceId } }));
  await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Cannot update organization B expense', 404, `/api/v1/finance/expenses/${bExpense.id}`, authOptions(adminA, { method: 'PATCH', body: { description: 'blocked' }, headers: { 'x-tenant-id': adminB.tenantId, 'x-workspace-id': adminB.workspaceId } }));

  const bInvoice = unwrap((await expectStatus(baseUrl, 'Finance', 'ADMIN_B', 'Create organization B invoice', 201, '/api/v1/finance/invoices', authOptions(adminB, { method: 'POST', body: invoicePayload(billingB.id, 'B') }))).body);
  await expectStatus(baseUrl, 'Finance', 'ADMIN', 'Cannot update organization B invoice', 404, `/api/v1/finance/invoices/${bInvoice.id}`, authOptions(adminA, { method: 'PATCH', body: { status: 'paid' } }));
}

async function verifyHr(baseUrl, prisma, auths) {
  const { adminA, managerA, memberA, noPermissionA, adminA2, adminB } = auths;
  await expectStatus(baseUrl, 'HR', 'UNAUTHENTICATED', 'Read workspace denied', 401, '/api/v1/hr/workspace');
  await expectStatus(baseUrl, 'HR', 'NO_REQUIRED_PERMISSION', 'Read workspace denied', 403, '/api/v1/hr/workspace', authOptions(noPermissionA));
  await expectStatus(baseUrl, 'HR', 'ADMIN', 'Read workspace', 200, '/api/v1/hr/workspace', authOptions(adminA));
  await expectStatus(baseUrl, 'HR', 'ADMIN', 'List employees', 200, '/api/v1/hr/employees', authOptions(adminA));
  await expectStatus(baseUrl, 'HR', 'ADMIN', 'Invalid employee input rejected', 400, '/api/v1/hr/employees', authOptions(adminA, { method: 'POST', body: {} }));

  const department = unwrap((await expectStatus(baseUrl, 'HR', 'ADMIN', 'Create department', 201, '/api/v1/hr/departments', authOptions(adminA, { method: 'POST', body: { name: `People Runtime ${runId}` } }))).body);
  const departmentDb = await prisma.department.findFirst({ where: { id: department.id, tenantId: adminA.tenantId, workspaceId: adminA.workspaceId, deletedAt: null } });
  recordPersistence('HR', 'Department create', department.id, departmentDb?.id, departmentDb?.id === department.id, 'department exists in scoped database query');

  const employee = unwrap((await expectStatus(baseUrl, 'HR', 'MANAGER', 'Create employee', 201, '/api/v1/hr/employees', authOptions(managerA, { method: 'POST', body: employeePayload('A') }))).body);
  const employeeDb = await prisma.employeeProfile.findFirst({ where: { id: employee.id, tenantId: adminA.tenantId, deletedAt: null } });
  recordPersistence('HR', 'Employee create', employee.id, employeeDb?.id, employeeDb?.id === employee.id, 'employee profile exists in tenant-scoped database query');
  await expectStatus(baseUrl, 'HR', 'MEMBER', 'Update employee', 200, `/api/v1/hr/employees/${employee.id}`, authOptions(memberA, { method: 'PATCH', body: { jobTitle: 'Updated Runtime Analyst' } }));

  const attendance = unwrap((await expectStatus(baseUrl, 'HR', 'ADMIN', 'Record attendance', 201, '/api/v1/hr/attendance', authOptions(adminA, { method: 'POST', body: { employeeId: employee.id, workDate: '2026-08-21T00:00:00.000Z', status: 'present' } }))).body);
  const attendanceDb = await prisma.attendanceRecord.findFirst({ where: { id: attendance.id, tenantId: adminA.tenantId, workspaceId: adminA.workspaceId, deletedAt: null } });
  recordPersistence('HR', 'Attendance create', attendance.id, attendanceDb?.id, attendanceDb?.id === attendance.id, 'attendance exists in scoped database query');
  await expectStatus(baseUrl, 'HR', 'MEMBER', 'Check in', 201, `/api/v1/hr/attendance/${employee.id}/check-in`, authOptions(memberA, { method: 'POST' }));
  await expectStatus(baseUrl, 'HR', 'MEMBER', 'Check out', 201, `/api/v1/hr/attendance/${employee.id}/check-out`, authOptions(memberA, { method: 'POST' }));
  await expectStatus(baseUrl, 'HR', 'ADMIN', 'HR copilot', 201, '/api/v1/hr/ai-hr-copilot', authOptions(adminA, { method: 'POST', body: { command: 'Show people summary' } }));
  await expectStatus(baseUrl, 'HR', 'MEMBER', 'HR copilot denied', 403, '/api/v1/hr/ai-hr-copilot', authOptions(memberA, { method: 'POST', body: { command: 'Show people summary' } }));

  const a2Department = unwrap((await expectStatus(baseUrl, 'HR', 'ADMIN_A2', 'Create workspace A2 department', 201, '/api/v1/hr/departments', authOptions(adminA2, { method: 'POST', body: { name: `People Runtime A2 ${runId}` } }))).body);
  const bDepartment = unwrap((await expectStatus(baseUrl, 'HR', 'ADMIN_B', 'Create organization B department', 201, '/api/v1/hr/departments', authOptions(adminB, { method: 'POST', body: { name: `People Runtime B ${runId}` } }))).body);
  const adminDepartments = unwrap((await expectStatus(baseUrl, 'HR', 'ADMIN', 'List departments excludes A2/B', 200, '/api/v1/hr/departments', authOptions(adminA, { headers: { 'x-workspace-id': adminA2.workspaceId, 'x-tenant-id': adminB.tenantId } }))).body);
  const leakedDepartment = Array.isArray(adminDepartments) && adminDepartments.some((row) => row.id === a2Department.id || row.id === bDepartment.id);
  recordPersistence('HR', 'Department isolation', 'no leaked department', leakedDepartment ? 'leaked' : 'no leaked department', !leakedDepartment, 'department list remains token-workspace scoped under spoofed headers');
}

async function verifyProjects(baseUrl, prisma, auths) {
  const { adminA, managerA, memberA, noPermissionA, adminA2, adminB } = auths;
  await expectStatus(baseUrl, 'Projects', 'UNAUTHENTICATED', 'List projects denied', 401, '/api/v1/projects');
  await expectStatus(baseUrl, 'Projects', 'NO_REQUIRED_PERMISSION', 'List projects denied', 403, '/api/v1/projects', authOptions(noPermissionA));
  await expectStatus(baseUrl, 'Projects', 'ADMIN', 'List projects', 200, '/api/v1/projects', authOptions(adminA));
  await expectStatus(baseUrl, 'Projects', 'ADMIN', 'Invalid project input rejected', 400, '/api/v1/projects', authOptions(adminA, { method: 'POST', body: {} }));

  const project = unwrap((await expectStatus(baseUrl, 'Projects', 'MANAGER', 'Create project', 201, '/api/v1/projects', authOptions(managerA, { method: 'POST', body: projectPayload('A') }))).body);
  const projectDb = await prisma.project.findFirst({ where: { id: project.id, tenantId: adminA.tenantId, workspaceId: adminA.workspaceId, deletedAt: null } });
  recordPersistence('Projects', 'Project create', project.id, projectDb?.id, projectDb?.id === project.id, 'project exists in scoped database query');
  await expectStatus(baseUrl, 'Projects', 'MEMBER', 'Update project', 200, `/api/v1/projects/${project.id}`, authOptions(memberA, { method: 'PATCH', body: { status: 'ACTIVE' } }));

  const task = unwrap((await expectStatus(baseUrl, 'Projects', 'MEMBER', 'Create task', 201, '/api/v1/projects/tasks', authOptions(memberA, { method: 'POST', body: { title: `Runtime Task ${runId}`, projectId: project.id, priority: 'HIGH' } }))).body);
  const taskDb = await prisma.task.findFirst({ where: { id: task.id, tenantId: adminA.tenantId, workspaceId: adminA.workspaceId, deletedAt: null } });
  recordPersistence('Projects', 'Task create', task.id, taskDb?.id, taskDb?.id === task.id, 'task exists in scoped database query');
  await expectStatus(baseUrl, 'Projects', 'MEMBER', 'Update task status', 200, `/api/v1/projects/tasks/${task.id}/status`, authOptions(memberA, { method: 'PATCH', body: { status: 'IN_PROGRESS' } }));
  await expectStatus(baseUrl, 'Projects', 'ADMIN', 'List tasks', 200, '/api/v1/projects/tasks', authOptions(adminA));

  const a2Project = unwrap((await expectStatus(baseUrl, 'Projects', 'ADMIN_A2', 'Create workspace A2 project', 201, '/api/v1/projects', authOptions(adminA2, { method: 'POST', body: projectPayload('A2') }))).body);
  const bProject = unwrap((await expectStatus(baseUrl, 'Projects', 'ADMIN_B', 'Create organization B project', 201, '/api/v1/projects', authOptions(adminB, { method: 'POST', body: projectPayload('B') }))).body);
  await expectStatus(baseUrl, 'Projects', 'ADMIN', 'Cannot update workspace A2 project', 404, `/api/v1/projects/${a2Project.id}`, authOptions(adminA, { method: 'PATCH', body: { name: 'blocked' } }));
  await expectStatus(baseUrl, 'Projects', 'ADMIN', 'Cannot link task to workspace A2 project', 404, '/api/v1/projects/tasks', authOptions(adminA, { method: 'POST', body: { title: 'blocked task', projectId: a2Project.id } }));
  await expectStatus(baseUrl, 'Projects', 'ADMIN', 'Cannot update organization B project', 404, `/api/v1/projects/${bProject.id}`, authOptions(adminA, { method: 'PATCH', body: { name: 'blocked' }, headers: { 'x-tenant-id': adminB.tenantId, 'x-workspace-id': adminB.workspaceId } }));
}

async function verifyAnalyticsAndAi(baseUrl, prisma, auths) {
  const { adminA, noPermissionA, adminA2, adminB } = auths;

  await expectStatus(baseUrl, 'CRM', 'ADMIN', 'Read CRM workspace for analytics fixture', 200, '/api/v1/crm/workspace', authOptions(adminA));
  const lead = unwrap((await expectStatus(baseUrl, 'CRM', 'ADMIN', 'Create analytics lead', 201, '/api/v1/crm/leads', authOptions(adminA, { method: 'POST', body: leadPayload('A') }))).body);
  const customer = unwrap((await expectStatus(baseUrl, 'CRM', 'ADMIN', 'Create analytics customer', 201, '/api/v1/crm/customers', authOptions(adminA, { method: 'POST', body: customerPayload('A') }))).body);
  const opportunity = unwrap((await expectStatus(baseUrl, 'CRM', 'ADMIN', 'Create analytics opportunity', 201, '/api/v1/crm/opportunities', authOptions(adminA, { method: 'POST', body: opportunityPayload('A', customer.id) }))).body);

  const a2Lead = unwrap((await expectStatus(baseUrl, 'CRM', 'ADMIN_A2', 'Create workspace A2 analytics lead', 201, '/api/v1/crm/leads', authOptions(adminA2, { method: 'POST', body: leadPayload('A2') }))).body);
  const bLead = unwrap((await expectStatus(baseUrl, 'CRM', 'ADMIN_B', 'Create organization B analytics lead', 201, '/api/v1/crm/leads', authOptions(adminB, { method: 'POST', body: leadPayload('B') }))).body);

  const leadDb = await prisma.crmLeadRecord.findFirst({ where: { id: lead.id, tenantId: adminA.tenantId, workspaceId: adminA.workspaceId, deletedAt: null } });
  recordPersistence('CRM', 'Analytics lead create', lead.id, leadDb?.id, leadDb?.id === lead.id, 'lead exists in scoped database query');
  const opportunityDb = await prisma.crmOpportunity.findFirst({ where: { id: opportunity.id, tenantId: adminA.tenantId, workspaceId: adminA.workspaceId, deletedAt: null } });
  recordPersistence('CRM', 'Analytics opportunity create', opportunity.id, opportunityDb?.id, opportunityDb?.id === opportunity.id, 'opportunity exists in scoped database query');

  await expectStatus(baseUrl, 'Analytics', 'UNAUTHENTICATED', 'Summary denied', 401, '/api/v1/analytics/summary');
  await expectStatus(baseUrl, 'Analytics', 'NO_REQUIRED_PERMISSION', 'Summary denied', 403, '/api/v1/analytics/summary', authOptions(noPermissionA));
  const summary = unwrap((await expectStatus(baseUrl, 'Analytics', 'ADMIN', 'Summary from live V1 data', 200, '/api/v1/analytics/summary', authOptions(adminA, { headers: { 'x-tenant-id': adminB.tenantId, 'x-workspace-id': adminA2.workspaceId } }))).body);
  const analyticsChecks = [
    ['CRM leads', 1, summary?.modules?.crm?.leads],
    ['CRM customers', 1, summary?.modules?.crm?.customers],
    ['CRM opportunities', 1, summary?.modules?.crm?.opportunities],
    ['CRM pipeline value', 50000, summary?.modules?.crm?.pipelineValue],
    ['Finance invoices', 1, summary?.modules?.finance?.invoices],
    ['HR employees', 1, summary?.modules?.hr?.employees],
    ['HR departments', 1, summary?.modules?.hr?.departments],
    ['Projects', 1, summary?.modules?.projects?.projects],
    ['Tasks', 1, summary?.modules?.projects?.tasks],
  ];
  for (const [entity, expected, actual] of analyticsChecks) {
    recordPersistence('Analytics', entity, expected, actual, actual === expected, 'summary is calculated from token-scoped workspace data');
  }
  if (summary?.scope?.tenantId !== adminA.tenantId || summary?.scope?.workspaceId !== adminA.workspaceId) {
    fail(`Analytics scope mismatch: ${JSON.stringify(summary?.scope)}`);
  }

  const a2Summary = unwrap((await expectStatus(baseUrl, 'Analytics', 'ADMIN_A2', 'Workspace A2 summary isolated', 200, '/api/v1/analytics/summary', authOptions(adminA2))).body);
  recordPersistence('Analytics', 'Workspace isolation lead count', 1, a2Summary?.modules?.crm?.leads, a2Summary?.modules?.crm?.leads === 1, `A2 lead ${a2Lead.id} is isolated to workspace A2`);
  const bSummary = unwrap((await expectStatus(baseUrl, 'Analytics', 'ADMIN_B', 'Organization B summary isolated', 200, '/api/v1/analytics/summary', authOptions(adminB))).body);
  recordPersistence('Analytics', 'Tenant isolation lead count', 1, bSummary?.modules?.crm?.leads, bSummary?.modules?.crm?.leads === 1, `B lead ${bLead.id} is isolated to organization B`);

  await expectStatus(baseUrl, 'AI', 'UNAUTHENTICATED', 'Context denied', 401, '/api/v1/ai/context');
  await expectStatus(baseUrl, 'AI', 'NO_REQUIRED_PERMISSION', 'Context denied', 403, '/api/v1/ai/context', authOptions(noPermissionA));
  const aiContext = unwrap((await expectStatus(baseUrl, 'AI', 'ADMIN', 'Authorized context from live V1 data', 200, '/api/v1/ai/context', authOptions(adminA))).body);
  const aiLeadNames = JSON.stringify(aiContext?.payload?.crm?.leads ?? []);
  const aiFinancial = aiContext?.payload?.financialState ?? {};
  recordPersistence('AI', 'Authorized CRM context count', 1, aiContext?.payload?.crm?.leads?.length, aiContext?.payload?.crm?.leads?.length === 1, 'AI context uses authenticated workspace CRM data');
  recordPersistence('AI', 'Authorized finance invoice count', 1, aiFinancial?.invoiceCount, aiFinancial?.invoiceCount === 1, 'AI context uses authenticated workspace finance data');
  if (aiLeadNames.includes(`V1 A2 Customer ${runId}`) || aiLeadNames.includes(`V1 B Customer ${runId}`)) {
    fail('AI context leaked another workspace or organization CRM record.');
  }
  await expectStatus(baseUrl, 'AI', 'ADMIN', 'Cross-workspace context request denied', 403, '/api/v1/ai/context', authOptions(adminA, { method: 'POST', body: { workspaceId: adminA2.workspaceId } }));
  await expectStatus(baseUrl, 'AI', 'ADMIN', 'Cross-tenant context request denied', 403, '/api/v1/ai/context', authOptions(adminA, { method: 'POST', body: { workspaceId: adminB.workspaceId }, headers: { 'x-tenant-id': adminB.tenantId, 'x-workspace-id': adminB.workspaceId } }));
  const chat = unwrap((await expectStatus(baseUrl, 'AI', 'ADMIN', 'Core AI chat controlled provider response', 201, '/api/v1/ai/chat', authOptions(adminA, { method: 'POST', body: { provider: 'local', message: 'Summarize my V1 business context.' } }))).body);
  const chatText = JSON.stringify(chat);
  if (chatText.includes(`V1 A2 Customer ${runId}`) || chatText.includes(`V1 B Customer ${runId}`)) {
    fail('AI chat response or metadata leaked another workspace or organization record.');
  }
  observations.push('Core AI provider runtime used the configured local-provider path; without LOCAL_LLM_ENDPOINT it returns a controlled provider-not-configured response while still validating authorized context assembly, persistence and error handling.');
}

async function verifyAuthTenantWorkspace(baseUrl, app, prisma, principals, auths) {
  const { adminA } = principals;
  const { adminAuthA, adminA: adminRoleA, noPermissionA } = auths;

  await expectStatus(baseUrl, 'Auth', 'PUBLIC', 'Duplicate email rejected', 409, '/api/v1/auth/signup', {
    method: 'POST',
    body: { email: adminA.user.email, password, displayName: 'Duplicate', tenantId: adminA.session.tenantId, workspaceId: adminA.session.workspaceId },
  });
  await expectStatus(baseUrl, 'Auth', 'PUBLIC', 'Weak password rejected', 400, '/api/v1/auth/signup', {
    method: 'POST',
    body: { email: `weak-${runId}@example.com`, password: 'short', displayName: 'Weak Runtime' },
  });
  await expectStatus(baseUrl, 'Auth', 'PUBLIC', 'Login invalid password rejected', 401, '/api/v1/auth/login', {
    method: 'POST',
    body: { email: adminA.user.email, password: 'WrongPassword!2026', tenantId: adminA.session.tenantId },
  });
  await expectStatus(baseUrl, 'Auth', 'PUBLIC', 'Unknown user rejected', 401, '/api/v1/auth/login', {
    method: 'POST',
    body: { email: `missing-${runId}@example.com`, password, tenantId: adminA.session.tenantId },
  });
  await expectStatus(baseUrl, 'Auth', 'PUBLIC', 'Malformed login rejected', 400, '/api/v1/auth/login', {
    method: 'POST',
    body: { email: 'not-an-email' },
  });

  await expectStatus(baseUrl, 'Auth', 'PUBLIC', 'Invalid access token rejected', 401, '/api/v1/auth/me', { token: 'not-a-valid-jwt' });
  const expiredAccessToken = await issueExpiredAccessToken(adminA);
  await expectStatus(baseUrl, 'Auth', 'PUBLIC', 'Expired access token rejected', 401, '/api/v1/auth/me', { token: expiredAccessToken });

  const login = await loginUser(baseUrl, adminA.user.email, adminA.session.tenantId);
  const decoded = decodeAccessToken(login.session.accessToken);
  const jwtClaimsOk = decoded.userId === adminA.user.id
    && decoded.sub === adminA.user.id
    && decoded.tenantId === adminA.session.tenantId
    && decoded.organizationId === adminA.session.organizationId
    && decoded.workspaceId === adminA.session.workspaceId
    && Array.isArray(decoded.permissions)
    && decoded.permissions.includes('read');
  recordPersistence('Auth', 'JWT context claims', 'canonical claims', jwtClaimsOk ? 'canonical claims' : JSON.stringify(decoded), jwtClaimsOk, 'JWT contains userId/sub/tenant/org/workspace/permissions from server-issued context');

  await expectStatus(baseUrl, 'Auth', 'ADMIN', 'Protected me before logout', 200, '/api/v1/auth/me', { token: login.session.accessToken });
  await expectStatus(baseUrl, 'Auth', 'ADMIN', 'Refresh token works before logout', 201, '/api/v1/auth/refresh', { method: 'POST', body: { refreshToken: login.session.refreshToken } });
  await expectStatus(baseUrl, 'Auth', 'ADMIN', 'Old refresh token rejected after rotation', 401, '/api/v1/auth/refresh', { method: 'POST', body: { refreshToken: login.session.refreshToken } });

  const freshLogin = await loginUser(baseUrl, adminA.user.email, adminA.session.tenantId);
  await expectStatus(baseUrl, 'Auth', 'ADMIN', 'Logout', 201, '/api/v1/auth/logout', { method: 'POST', token: freshLogin.session.accessToken });
  await expectStatus(baseUrl, 'Auth', 'ADMIN', 'Refresh token rejected after logout', 401, '/api/v1/auth/refresh', { method: 'POST', body: { refreshToken: freshLogin.session.refreshToken } });
  await expectStatus(baseUrl, 'Auth', 'ADMIN', 'Access token rejected after logout', 401, '/api/v1/auth/me', { token: freshLogin.session.accessToken });

  await expectStatus(baseUrl, 'Tenant', 'UNAUTHENTICATED', 'Create organization denied', 401, '/api/v1/tenants/organizations', { method: 'POST', body: { name: 'Denied Runtime', countryCode: 'US' } });
  await expectStatus(baseUrl, 'Tenant', 'NO_REQUIRED_PERMISSION', 'Create organization denied', 403, '/api/v1/tenants/organizations', authOptions(noPermissionA, { method: 'POST', body: { name: 'Denied Runtime', countryCode: 'US' } }));
  const org = unwrap((await expectStatus(baseUrl, 'Tenant', 'ADMIN', 'Create organization', 201, '/api/v1/tenants/organizations', authOptions(adminRoleA, { method: 'POST', body: { name: `Runtime Org ${runId}`, countryCode: 'US', industry: 'technology' } }))).body);
  const orgDb = await prisma.organization.findFirst({ where: { id: org.id, tenantId: adminA.session.tenantId, deletedAt: null } });
  recordPersistence('Tenant', 'Organization create', org.id, orgDb?.id, orgDb?.id === org.id, 'organization exists in tenant-scoped database query');

  await expectStatus(baseUrl, 'Workspace', 'UNAUTHENTICATED', 'Current workspace denied', 401, '/api/v1/workspaces/current');
  await expectStatus(baseUrl, 'Workspace', 'NO_REQUIRED_PERMISSION', 'Current workspace denied', 403, '/api/v1/workspaces/current', authOptions(noPermissionA));
  const currentWorkspace = unwrap((await expectStatus(baseUrl, 'Workspace', 'ADMIN', 'Current workspace', 200, '/api/v1/workspaces/current', authOptions(adminRoleA, { headers: { 'x-workspace-id': org.id, 'x-tenant-id': org.id } }))).body);
  recordPersistence('Workspace', 'Header spoofing current workspace', adminA.session.workspaceId, currentWorkspace?.id, currentWorkspace?.id === adminA.session.workspaceId, 'current workspace is derived from JWT context, not spoofed headers');

  const workspace = unwrap((await expectStatus(baseUrl, 'Workspace', 'ADMIN', 'Create workspace under new organization', 201, '/api/v1/workspaces', authOptions(adminRoleA, {
    method: 'POST',
    body: {
      organizationId: org.id,
      name: `Runtime Created Workspace ${runId}`,
      slug: `runtime-created-${runId}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      description: 'Runtime workspace persistence validation.',
    },
  }))).body);
  const workspaceDb = await prisma.workspace.findFirst({ where: { id: workspace.id, tenantId: adminA.session.tenantId, organizationId: org.id, deletedAt: null } });
  recordPersistence('Workspace', 'Workspace create', workspace.id, workspaceDb?.id, workspaceDb?.id === workspace.id, 'workspace exists in tenant/org scoped database query');

  const createdWorkspaceAuth = await issueRoleToken(app, adminA, 'ADMIN', workspace.id);
  await expectStatus(baseUrl, 'Workspace', 'ADMIN', 'Created workspace membership allows access', 200, '/api/v1/workspaces/current', authOptions(createdWorkspaceAuth));
  await prisma.workspaceMember.updateMany({
    where: { tenantId: adminA.session.tenantId, workspaceId: workspace.id, userId: adminA.user.id },
    data: { status: 'REMOVED', deletedAt: new Date() },
  });
  await expectStatus(baseUrl, 'Workspace', 'ADMIN', 'Revoked workspace membership denies access', 401, '/api/v1/workspaces/current', authOptions(createdWorkspaceAuth));

  const member = await signupUser(baseUrl, {
    email: `v1-member-login-${runId}@example.com`,
    displayName: 'V1 Persistence Member',
    tenantId: adminA.session.tenantId,
    workspaceId: adminA.session.workspaceId,
    role: 'MEMBER',
  });
  const memberLogin = await loginUser(baseUrl, member.user.email, adminA.session.tenantId);
  const memberMe = unwrap((await expectStatus(baseUrl, 'Auth', 'MEMBER', 'Login again restores workspace context', 200, '/api/v1/auth/me', { token: memberLogin.session.accessToken })).body);
  recordPersistence('Auth', 'Login again persistence', adminA.session.workspaceId, memberMe?.workspaceId, memberMe?.workspaceId === adminA.session.workspaceId, 'backend returns persisted workspace membership after login');
}

async function main() {
  const { app, baseUrl } = await createApp();
  try {
    const prisma = app.get(PrismaServiceClass, { strict: false });
    const companyA = `NEXORA V1 Runtime A ${runId}`;
    const companyB = `NEXORA V1 Runtime B ${runId}`;

    const adminA = await signupUser(baseUrl, {
      email: `v1-admin-a-${runId}@example.com`,
      displayName: 'V1 Runtime Admin A',
      companyName: companyA,
      role: 'ADMIN',
    });
    const managerA = await signupUser(baseUrl, {
      email: `v1-manager-a-${runId}@example.com`,
      displayName: 'V1 Runtime Manager A',
      tenantId: adminA.session.tenantId,
      workspaceId: adminA.session.workspaceId,
      role: 'MANAGER',
    });
    const memberA = await signupUser(baseUrl, {
      email: `v1-member-a-${runId}@example.com`,
      displayName: 'V1 Runtime Member A',
      tenantId: adminA.session.tenantId,
      workspaceId: adminA.session.workspaceId,
      role: 'MEMBER',
    });
    const noPermissionA = await signupUser(baseUrl, {
      email: `v1-no-permission-a-${runId}@example.com`,
      displayName: 'V1 Runtime No Permission A',
      tenantId: adminA.session.tenantId,
      workspaceId: adminA.session.workspaceId,
      role: 'NO_REQUIRED_PERMISSION',
    });
    const adminB = await signupUser(baseUrl, {
      email: `v1-admin-b-${runId}@example.com`,
      displayName: 'V1 Runtime Admin B',
      companyName: companyB,
      role: 'ADMIN',
    });

    const adminAuthA = {
      role: 'ADMIN',
      token: adminA.session.accessToken,
      tenantId: adminA.session.tenantId,
      organizationId: adminA.session.organizationId,
      workspaceId: adminA.session.workspaceId,
    };
    const adminRoleA = await issueRoleToken(app, adminA, 'ADMIN');
    const managerRoleA = await issueRoleToken(app, managerA, 'MANAGER');
    const memberRoleA = await issueRoleToken(app, memberA, 'MEMBER');
    const noPermissionRoleA = await issueRoleToken(app, noPermissionA, 'NO_REQUIRED_PERMISSION');
    const adminRoleB = await issueRoleToken(app, adminB, 'ADMIN');

    const workspaceA2 = await createSecondaryWorkspace(baseUrl, adminRoleA, 'A2');
    const adminRoleA2 = await issueRoleToken(app, adminA, 'ADMIN', workspaceA2.id);

    await ensureCurrency(prisma, 'USD');
    const billingA = await ensureBillingAccount(prisma, adminA, 'a');
    const billingB = await ensureBillingAccount(prisma, adminB, 'b');

    const principals = { adminA, managerA, memberA, noPermissionA, adminB };
    const auths = {
      adminAuthA,
      adminA: adminRoleA,
      managerA: managerRoleA,
      memberA: memberRoleA,
      noPermissionA: noPermissionRoleA,
      adminA2: adminRoleA2,
      adminB: adminRoleB,
    };

    await verifyAuthTenantWorkspace(baseUrl, app, prisma, principals, auths);
    await verifyFinance(baseUrl, prisma, auths, { billingA, billingB });
    await verifyHr(baseUrl, prisma, auths);
    await verifyProjects(baseUrl, prisma, auths);
    await verifyAnalyticsAndAi(baseUrl, prisma, auths);
  } finally {
    await app.close();
  }

  const summary = {
    status: failures.length ? 'failed' : 'passed',
    checkedAt: new Date().toISOString(),
    baseUrl,
    runId,
    matrix,
    persistence,
    observations,
    failures,
  };
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(JSON.stringify({ status: 'failed', error: error.message, stack: error.stack }, null, 2));
  process.exit(1);
});
