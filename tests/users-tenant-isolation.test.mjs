import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { loadApiSource } from './helpers/api-source.mjs';

const require = createRequire(import.meta.url);
require('reflect-metadata');
const { BadRequestException, ConflictException, ForbiddenException } = require('@nestjs/common');
const { UsersService } = loadApiSource('modules/users/users.service.ts');
const { TenantContextService } = loadApiSource('modules/tenants/tenant-context.service.ts');

const authorizedTenant = '11111111-1111-4111-8111-111111111111';
const foreignTenant = '22222222-2222-4222-8222-222222222222';
const input = { email: 'new-user@example.invalid', displayName: 'Example User', locale: 'en-US' };

function fixture({ tenantId = authorizedTenant, missingContext = false, existing = null } = {}) {
  const calls = [];
  const prisma = {
    user: {
      findUnique: async query => {
        calls.push({ method: 'findUnique', query });
        return existing;
      },
      create: async query => {
        calls.push({ method: 'create', query });
        return { id: 'created-user', ...query.data };
      },
    },
  };
  const context = new TenantContextService({ get: () => missingContext ? undefined : { tenantId } }, prisma);
  return { calls, service: new UsersService(prisma, context) };
}

test('a foreign tenant in user input is forbidden before any Prisma query', async () => {
  const { service, calls } = fixture();

  await assert.rejects(service.create({ ...input, tenantId: foreignTenant }), error =>
    error instanceof ForbiddenException && error.getStatus() === 403,
  );
  assert.deepEqual(calls, []);
});

test('an explicitly supplied empty or null tenant cannot replace authenticated scope', async () => {
  for (const tenantId of ['', null]) {
    const { service, calls } = fixture();
    await assert.rejects(service.create({ ...input, tenantId }), error =>
      error instanceof ForbiddenException && error.getStatus() === 403,
    );
    assert.deepEqual(calls, []);
  }
});

test('missing authenticated tenant context preserves the existing context guard and does not query Prisma', async () => {
  for (const tenantId of [undefined, authorizedTenant, foreignTenant]) {
    const { service, calls } = fixture({ missingContext: true });

    await assert.rejects(service.create({ ...input, tenantId }), error =>
      error instanceof BadRequestException
      && error.getStatus() === 400
      && error.message === 'Tenant context is required',
    );
    assert.deepEqual(calls, []);
  }
});

test('omitting tenantId creates the user in the authenticated tenant with the existing whitelisted fields', async () => {
  const { service, calls } = fixture();
  const result = await service.create({ ...input, status: 'DELETED', deletedAt: new Date(), roleIds: ['untrusted-role'] });

  assert.deepEqual(calls, [
    { method: 'findUnique', query: { where: { tenantId_email: { tenantId: authorizedTenant, email: input.email } } } },
    { method: 'create', query: { data: { tenantId: authorizedTenant, ...input, status: 'ACTIVE' } } },
  ]);
  assert.deepEqual(result, { id: 'created-user', tenantId: authorizedTenant, ...input, status: 'ACTIVE' });
});

test('an explicitly matching tenant remains compatible and uses the authenticated scope', async () => {
  const { service, calls } = fixture();
  const result = await service.create({ ...input, tenantId: authorizedTenant });

  assert.equal(result.tenantId, authorizedTenant);
  assert.deepEqual(calls[0].query, { where: { tenantId_email: { tenantId: authorizedTenant, email: input.email } } });
  assert.deepEqual(calls[1].query, { data: { tenantId: authorizedTenant, ...input, status: 'ACTIVE' } });
});

test('optional locale and default ACTIVE status are preserved', async () => {
  const { service, calls } = fixture();
  const result = await service.create({ email: input.email, displayName: input.displayName });

  assert.equal(result.status, 'ACTIVE');
  assert.deepEqual(calls[1].query.data, {
    tenantId: authorizedTenant,
    email: input.email,
    displayName: input.displayName,
    locale: undefined,
    status: 'ACTIVE',
  });
});

test('duplicate users return the existing 409 conflict within the authenticated tenant without creating another user', async () => {
  for (const tenantId of [undefined, authorizedTenant]) {
    const { service, calls } = fixture({ existing: { id: 'existing-user' } });

    await assert.rejects(service.create({ ...input, tenantId }), error =>
      error instanceof ConflictException && error.getStatus() === 409 && error.message === 'User already exists',
    );
    assert.deepEqual(calls, [
      { method: 'findUnique', query: { where: { tenantId_email: { tenantId: authorizedTenant, email: input.email } } } },
    ]);
  }
});
