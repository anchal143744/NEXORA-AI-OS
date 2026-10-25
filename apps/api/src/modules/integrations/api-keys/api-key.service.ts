import { Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
@Injectable()
export class ApiKeyService { constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}
  async create(input: { name: string; scopes?: string[]; expiresAt?: string }) { const tenantId = this.context.currentTenantId(); const raw = `nx_${randomBytes(32).toString('hex')}`; const keyHash = createHash('sha256').update(raw).digest('hex'); const key = await this.prisma.apiKey.create({ data: { tenantId, userId: this.context.context()?.userId, name: input.name, keyHash, scopes: input.scopes ?? [], expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined } }); await this.events.publish({ tenantId, type: 'api_key.created', source: 'api-key-service', subject: { type: 'apiKey', id: key.id }, payload: { name: input.name, scopes: input.scopes ?? [] } }); return { ...key, key: raw }; }
  list() { return this.prisma.apiKey.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, orderBy: { createdAt: 'desc' } }); }
  async rotate(id: string) { const raw = `nx_${randomBytes(32).toString('hex')}`; const keyHash = createHash('sha256').update(raw).digest('hex'); const key = await this.prisma.apiKey.update({ where: { id }, data: { keyHash } }); return { ...key, key: raw }; }
  revoke(id: string) { return this.prisma.apiKey.update({ where: { id }, data: { revokedAt: new Date() } }); }
  hasPermission(scopes: string[], permission: string) { return scopes.includes('*') || scopes.includes(permission); }
}
