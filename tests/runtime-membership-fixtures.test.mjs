import assert from 'node:assert/strict';
import test from 'node:test';
import { assertDisposableRuntimeDatabase, createRuntimeFixtureProvisioner } from '../scripts/test-fixtures/runtime-membership.mjs';

const env = { DATABASE_URL: 'postgresql://synthetic:synthetic@127.0.0.1:65432/nexora_ci_test', NEXORA_TEST_DATABASE_DISPOSABLE: 'true' };
const owner = { user: { id: 'owner-id', email: 'owner-run1@example.com' }, session: { tenantId: 'tenant-a', organizationId: 'org-a', workspaceId: 'workspace-a' } };
const input = { tenantId: 'tenant-a', workspaceId: 'workspace-a', email: 'member-run1@example.com', displayName: 'Synthetic Member', password: 'Synthetic-only-password' };
function fixture(options = {}) {
  const writes = [], reads = [];
  const database = {
    $queryRawUnsafe: async sql => { reads.push({ sql }); return [{ database_name: options.databaseName ?? 'nexora_ci_test' }]; },
    user: { findFirst: async query => { reads.push({ kind: 'owner-user', query }); return options.missingOwner ? null : { id: owner.user.id }; } },
    workspace: { findFirst: async query => { reads.push({ kind: 'owner-workspace', query }); return { id: 'workspace-a' }; } },
    membership: { findFirst: async query => { reads.push({ kind: 'owner-membership', query }); return { id: 'owner-membership' }; } },
  };
  const tx = {
    workspace: { findFirst: async query => { reads.push({ kind: 'target-workspace', query }); return options.missingTarget ? null : { id: 'workspace-a', organizationId: 'org-a' }; } },
    membership: { findFirst: async query => { reads.push({ kind: 'actor-membership', query }); return options.revokedOwner ? null : { id: 'owner-membership' }; }, create: async value => { writes.push({ kind: 'membership', ...value }); return value.data; } },
    user: { create: async value => { writes.push({ kind: 'user', ...value }); return { id: 'member-id', ...value.data }; } },
    credential: { create: async value => { writes.push({ kind: 'credential', ...value }); return value.data; } },
    workspaceMember: { create: async value => { writes.push({ kind: 'workspaceMember', ...value }); return value.data; } },
  };
  const prisma = { database, transaction: async work => work(tx) };
  const provisioner = createRuntimeFixtureProvisioner({ prisma, hashPassword: async () => 'synthetic-hash', runId: 'run1', env: options.env ?? env });
  return { provisioner, reads, writes };
}

test('runtime fixtures reject non-test, remote and unacknowledged databases before access', () => {
  for (const changes of [ { NEXORA_TEST_DATABASE_DISPOSABLE: '' }, { DATABASE_URL: '' }, { DATABASE_URL: 'postgresql://synthetic:synthetic@127.0.0.1:65432/nexora' }, { DATABASE_URL: 'postgresql://synthetic:synthetic@remote.example.invalid/nexora_ci_test' } ]) {
    assert.throws(() => assertDisposableRuntimeDatabase({ ...env, ...changes }), /Runtime fixtures/);
  }
  assert.deepEqual(assertDisposableRuntimeDatabase(env), { databaseName: 'nexora_ci_test' });
});

test('database identity and owner provenance must match before any fixture writes', async () => {
  for (const options of [{ databaseName: 'different_test' }, { missingOwner: true }]) {
    const f = fixture(options);
    await assert.rejects(f.provisioner.registerOwner(owner), /database identity|newly registered owner/);
    assert.deepEqual(f.writes, []);
  }
});

test('unregistered targets and real contact addresses are rejected before writes', async () => {
  const f = fixture();
  await assert.rejects(f.provisioner.provisionMember(input), /not an owned workspace/);
  await assert.rejects(f.provisioner.registerOwner({ ...owner, user: { ...owner.user, email: 'person@real.invalid' } }), /synthetic example/);
  assert.deepEqual(f.writes, []);
});

test('revoked owner or mismatched workspace prevents every write', async () => {
  for (const options of [{ revokedOwner: true }, { missingTarget: true }]) {
    const f = fixture(options);
    await f.provisioner.registerOwner(owner);
    await assert.rejects(f.provisioner.provisionMember(input), /ownership or membership/);
    assert.deepEqual(f.writes, []);
  }
});

test('member fixture persists credentials and both tenant-bound memberships atomically', async () => {
  const f = fixture();
  await f.provisioner.registerOwner(owner);
  const user = await f.provisioner.provisionMember(input);
  assert.equal(user.id, 'member-id');
  assert.deepEqual(f.writes.map(row => row.kind), ['user', 'credential', 'membership', 'workspaceMember']);
  assert.ok(f.writes.every(row => row.data.tenantId === 'tenant-a'));
  assert.equal(f.writes.find(row => row.kind === 'membership').data.organizationId, 'org-a');
  assert.equal(f.writes.find(row => row.kind === 'membership').data.title, 'Member');
  assert.equal(f.writes.find(row => row.kind === 'workspaceMember').data.workspaceId, 'workspace-a');
  assert.equal(f.writes.find(row => row.kind === 'credential').data.passwordHash, 'synthetic-hash');
  assert.ok(!JSON.stringify(f.writes).includes(input.password));
  assert.ok(f.reads.filter(row => row.kind === 'target-workspace').every(row => row.query.where.tenantId === 'tenant-a' && row.query.where.organizationId === 'org-a'));
});

test('a changed acknowledgement cannot reuse an already registered fixture authority', async () => {
  const localEnv = { ...env };
  const f = fixture({ env: localEnv });
  await f.provisioner.registerOwner(owner);
  localEnv.NEXORA_TEST_DATABASE_DISPOSABLE = 'false';
  await assert.rejects(f.provisioner.provisionMember(input), /acknowledgement/);
  assert.deepEqual(f.writes, []);
});

test('real member login must keep persisted scope and cannot acquire owner permissions', async () => {
  const f = fixture();
  await f.provisioner.registerOwner(owner);
  const member = await f.provisioner.provisionMember(input);
  const claims = { sub: member.id, tenantId: 'tenant-a', organizationId: 'org-a', workspaceId: 'workspace-a', role: 'Member', roles: ['Member'], permissions: [] };
  const principal = value => ({ user: { id: member.id, roles: ['Member'] }, session: { ...owner.session, accessToken: `header.${Buffer.from(JSON.stringify(value)).toString('base64url')}.signature` } });
  assert.doesNotThrow(() => f.provisioner.assertMemberLogin(principal(claims), input, member));
  for (const change of [{ roles: ['Organization Owner'] }, { role: 'ADMIN' }, { permissions: ['manage'] }, { workspaceId: 'other-workspace' }, { sub: 'another-user' }]) {
    assert.throws(() => f.provisioner.assertMemberLogin(principal({ ...claims, ...change }), input, member), /persisted Member scope/);
  }
});
