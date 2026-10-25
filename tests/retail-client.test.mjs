import assert from 'node:assert/strict';
import test from 'node:test';
import { assertReleaseVersions, assertRegisteredWorkspaceModule, loadWebModule } from './helpers/web-contracts.mjs';
import { hasUnfinishedComment } from '../scripts/release-marker-scan.mjs';

test('release checks reject mismatched manifests and invalid versions', () => {
  const packages = ['root', 'api', 'web'].map(name => ({ name, version: '1.2.3' }));
  const lock = { packages: { '': { version: '1.2.3' } } };
  assertReleaseVersions(packages, lock);
  assert.throws(() => assertReleaseVersions([packages[0], { version: '9.0.0' }, packages[2]], lock));
  assert.throws(() => assertReleaseVersions(packages, { packages: { '': { version: '9.0.0' } } }));
  assert.throws(() => assertReleaseVersions([{ version: 'unreleased' }, ...packages.slice(1)], lock));
  assert.throws(() => assertRegisteredWorkspaceModule('launch-readiness', '/missing-route', 'LaunchRC'));
});

test('release marker scanner distinguishes unfinished comments from database statuses', () => {
  assert.equal(hasUnfinishedComment("const status = 'TODO';", 'status.ts'), false);
  assert.equal(hasUnfinishedComment('// TODO implement authorization\nconst status = 1;', 'status.ts'), true);
  assert.equal(hasUnfinishedComment('/* FIXME payment reconciliation */', 'status.ts'), true);
});

test('CSV preserves exact negative amounts and escapes hostile labels, quotes and commas', () => {
  const { reportCsv } = loadWebModule('features/shop/shop-values.ts');
  assert.equal(reportCsv([['netProfit', '-10.10'], ['=SUM(A1:A2)', '0.00'], ['a,"b"', '1.234']]), '"netProfit","-10.10"\r\n"\'=SUM(A1:A2)","0.00"\r\n"a,""b""","1.234"');
  assert.match(reportCsv([['  =HYPERLINK("evil")']]), /^"'/);
});

test('low stock comparisons preserve four decimal places at schema limits', () => {
  const { quantityAtOrBelow } = loadWebModule('features/shop/shop-values.ts');
  assert.equal(quantityAtOrBelow('99999999999999.0001', '99999999999999.0000'), false);
  assert.equal(quantityAtOrBelow('0.0001', '0.0001'), true);
  assert.equal(quantityAtOrBelow('0', '2.5'), true);
  assert.throws(() => quantityAtOrBelow('NaN', '0'));
});

function clientFixture(t, handler) {
  const previousWindow = globalThis.window; const previousFetch = globalThis.fetch;
  let stored = { user: { id: 'user', tenantId: 'tenant', organizationId: 'organization', workspaceId: 'workspace' }, session: { id: 'session', accessToken: 'old', tenantId: 'tenant', organizationId: 'organization', workspaceId: 'workspace' } };
  globalThis.window = { localStorage: { getItem: () => JSON.stringify(stored) } };
  globalThis.fetch = handler;
  t.after(() => { globalThis.fetch = previousFetch; if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow; });
  const store = { setSession: (user, session) => { stored = { user, session }; } };
  const client = loadWebModule('lib/api-client.ts', { '@/lib/env': { publicRuntimeEnv: { apiBaseUrl: '/api' } }, '@/stores/auth-store': { useAuthStore: { getState: () => store } } });
  return { ...client, current: () => stored, logout: () => { stored = {}; } };
}
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

test('parallel expired requests refresh once then retry with the same tenant and idempotency key', async t => {
  let refreshes = 0; let requests = 0; let fixture;
  fixture = clientFixture(t, async (url, options) => {
    if (url.endsWith('/auth/refresh')) {
      refreshes++; await new Promise(resolve => setTimeout(resolve, 10));
      assert.deepEqual(JSON.parse(options.body), { sessionTransport: 'cookie' });
      return json({ success: true, data: { ...fixture.current(), session: { ...fixture.current().session, accessToken: 'new' } } });
    }
    requests++; assert.equal(options.headers.get('x-tenant-id'), 'tenant'); assert.equal(options.headers.get('x-organization-id'), 'organization');
    assert.deepEqual(JSON.parse(options.body), { idempotencyKey: 'same-key' });
    return options.headers.get('Authorization') === 'Bearer old' ? json({ message: 'expired' }, 401) : json({ success: true, data: 'saved' });
  });
  assert.deepEqual(await Promise.all([1, 2, 3].map(() => fixture.apiRequest('/v1/retail/payments', { method: 'POST', body: { idempotencyKey: 'same-key' } }))), ['saved', 'saved', 'saved']);
  assert.equal(refreshes, 1); assert.equal(requests, 6); assert.equal(fixture.current().session.accessToken, 'new');
});

test('revoked sessions do not loop or retry financial operations', async t => {
  let calls = 0;
  const fixture = clientFixture(t, async () => { calls++; return json({ message: 'revoked' }, 401); });
  await assert.rejects(fixture.apiRequest('/v1/retail/sales'), error => error.status === 401);
  assert.equal(calls, 2);
});

test('logout while refreshing cannot restore the old account', async t => {
  let fixture;
  fixture = clientFixture(t, async url => {
    if (!url.endsWith('/auth/refresh')) return json({}, 401);
    const previous = fixture.current(); fixture.logout();
    return json({ ...previous, session: { ...previous.session, accessToken: 'new' } });
  });
  await assert.rejects(fixture.apiRequest('/v1/retail/sales'), error => error.status === 401);
  assert.deepEqual(fixture.current(), {});
});

test('upstream cancellation reaches fetch immediately', async t => {
  let called = false;
  const fixture = clientFixture(t, async (_url, options) => { called = true; assert.equal(options.signal.aborted, true); throw new DOMException('aborted', 'AbortError'); });
  const controller = new AbortController(); controller.abort();
  await assert.rejects(fixture.apiRequest('/v1/retail/sales', { signal: controller.signal }));
  assert.equal(called, true);
});
