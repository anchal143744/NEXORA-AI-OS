// Privileged test setup only. This is not an application invitation endpoint.
// Runtime suites keep their real signup/login, session and authorization checks.
export function assertDisposableRuntimeDatabase(env = process.env) {
  if (env.NEXORA_TEST_DATABASE_DISPOSABLE !== 'true') {
    throw new Error('Runtime fixtures require explicit disposable-test-database acknowledgement');
  }
  let url;
  try { url = new URL(env.DATABASE_URL); } catch { throw new Error('Runtime fixtures require a configured disposable test database'); }
  const name = decodeURIComponent(url.pathname.replace(/^\//, ''));
  if (!['postgres:', 'postgresql:'].includes(url.protocol)
    || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    || !/(?:^|[_-])test(?:$|[_-])/i.test(name)) {
    throw new Error('Runtime fixtures refuse non-loopback or non-test databases');
  }
  return { databaseName: name };
}

export function createRuntimeFixtureProvisioner({ prisma, hashPassword, runId, env = process.env }) {
  assertDisposableRuntimeDatabase(env);
  if (typeof runId !== 'string' || !runId || typeof hashPassword !== 'function') throw new Error('Invalid runtime fixture setup');
  const database = prisma.database ?? prisma;
  const owners = new Map();
  function requireSyntheticEmail(email) {
    if (typeof email !== 'string' || !email.includes(runId) || !/@example\.(?:com|invalid)$/i.test(email)) {
      throw new Error("Runtime fixtures accept only this run's synthetic example addresses");
    }
  }
  async function verifyDatabase() {
    const expected = assertDisposableRuntimeDatabase(env);
    const rows = await database.$queryRawUnsafe('SELECT current_database() AS database_name');
    if (rows?.[0]?.database_name !== expected.databaseName) throw new Error('Runtime fixture database identity does not match its guarded configuration');
  }
  async function registerOwner(principal) {
    requireSyntheticEmail(principal?.user?.email);
    await verifyDatabase();
    const { tenantId, organizationId, workspaceId } = principal.session ?? {};
    const userId = principal.user.id;
    if (!tenantId || !organizationId || !workspaceId || !userId) throw new Error('Missing fixture owner scope');
    const user = await database.user.findFirst({ where: { tenantId, id: userId, email: principal.user.email, deletedAt: null }, select: { id: true } });
    const workspace = await database.workspace.findFirst({ where: { tenantId, id: workspaceId, organizationId, deletedAt: null, organization: { tenantId, deletedAt: null } }, select: { id: true } });
    const membership = await database.membership.findFirst({ where: { tenantId, organizationId, userId, title: 'Organization Owner', deletedAt: null }, select: { id: true } });
    if (!user || !workspace || !membership || owners.has(tenantId)) throw new Error('Fixture owner must be a newly registered owner in this run');
    owners.set(tenantId, { userId, organizationId });
  }
  async function provisionMember(input) {
    assertDisposableRuntimeDatabase(env);
    requireSyntheticEmail(input.email);
    const owner = owners.get(input.tenantId);
    if (!owner || !input.workspaceId) throw new Error('Fixture target is not an owned workspace from this test run');
    await verifyDatabase();
    const passwordHash = await hashPassword(input.password);
    return prisma.transaction(async tx => {
      const workspace = await tx.workspace.findFirst({ where: { tenantId: input.tenantId, id: input.workspaceId, organizationId: owner.organizationId, deletedAt: null, organization: { tenantId: input.tenantId, deletedAt: null } }, select: { id: true, organizationId: true } });
      const actor = await tx.membership.findFirst({ where: { tenantId: input.tenantId, organizationId: owner.organizationId, userId: owner.userId, title: 'Organization Owner', deletedAt: null }, select: { id: true } });
      if (!workspace || !actor) throw new Error('Fixture target ownership or membership is no longer valid');
      const user = await tx.user.create({ data: { tenantId: input.tenantId, email: input.email.trim().toLowerCase(), displayName: input.displayName, status: 'ACTIVE', metadata: { source: 'disposable-runtime-fixture', runId } } });
      await tx.credential.create({ data: { tenantId: input.tenantId, userId: user.id, passwordHash, passwordChangedAt: new Date() } });
      await tx.membership.create({ data: { tenantId: input.tenantId, organizationId: workspace.organizationId, userId: user.id, title: 'Member', metadata: { source: 'disposable-runtime-fixture', runId } } });
      await tx.workspaceMember.create({ data: { tenantId: input.tenantId, workspaceId: workspace.id, userId: user.id, status: 'ACTIVE' } });
      return user;
    });
  }
  function assertMemberLogin(principal, input, fixtureUser) {
    const owner = owners.get(input.tenantId);
    let claims;
    try { claims = JSON.parse(Buffer.from(principal.session.accessToken.split('.')[1], 'base64url').toString('utf8')); } catch { throw new Error('Fixture login did not return a readable access token'); }
    const expected = { tenantId: input.tenantId, organizationId: owner?.organizationId, workspaceId: input.workspaceId };
    if (!owner || principal.user.id !== fixtureUser.id || claims.sub !== fixtureUser.id
      || Object.entries(expected).some(([key, value]) => !value || principal.session[key] !== value || claims[key] !== value)
      || JSON.stringify(principal.user.roles) !== '["Member"]'
      || JSON.stringify(claims.roles) !== '["Member"]'
      || claims.role !== 'Member' || !Array.isArray(claims.permissions) || claims.permissions.length !== 0) {
      throw new Error('Fixture login must resolve its persisted Member scope without owner permissions');
    }
  }
  return { verifyDatabase, registerOwner, provisionMember, assertMemberLogin };
}
