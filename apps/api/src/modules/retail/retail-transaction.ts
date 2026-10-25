import { BadRequestException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createHash } from 'node:crypto';
import type { RetailScope } from './retail-access.service';

export function requestHash(value: unknown) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
export function key(value: string) {
  if (!value || value.length > 120 || !/^[A-Za-z0-9:_-]+$/.test(value)) throw new BadRequestException('A stable idempotency key of at most 120 characters is required');
  return value;
}
export function reason(value: string) { if (!value?.trim() || value.length > 500) throw new BadRequestException('A reason of 1–500 characters is required'); return value.trim(); }
export function matchRequest(actual: string | undefined, expected: string) { if (actual !== expected) throw new ConflictException('Idempotency key has already been used for a different request'); }
export async function lock(tx: Prisma.TransactionClient, value: string) {
  await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${value}, 0))::text AS locked`;
}
export async function audit(tx: Prisma.TransactionClient, scope: RetailScope, resourceType: string, resourceId: string, after: Prisma.InputJsonValue) {
  await tx.auditLog.create({ data: { tenantId: scope.tenantId, actorUserId: scope.userId, action: 'UPDATE', resourceType, resourceId, after, metadata: { organizationId: scope.organizationId, workspaceId: scope.workspaceId } } });
}
export async function currency(tx: Prisma.TransactionClient, code: string) {
  const record = await tx.currency.findFirst({ where: { code, enabled: true, deletedAt: null } });
  if (!record || record.roundingMode !== 'HALF_UP' || record.precision < 0 || record.precision > 4) throw new BadRequestException('Currency must be configured with supported precision and HALF_UP rounding');
  return record;
}
