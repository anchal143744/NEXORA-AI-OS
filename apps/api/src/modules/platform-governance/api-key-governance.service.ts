import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateGovernedApiKeyDto } from './dto/platform-governance.dto';

@Injectable()
export class ApiKeyGovernanceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  list() {
    return this.prisma.apiKey.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async create(dto: CreateGovernedApiKeyDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    const raw = 'nx_' + randomBytes(32).toString('hex');
    const keyHash = createHash('sha256').update(raw).digest('hex');
    const record = await this.prisma.apiKey.create({ data: { tenantId, userId: this.context.context()?.userId, name: dto.name, keyHash, scopes: dto.scopes ?? [], expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined } });
    await this.events.publish({ tenantId, workspaceId, type: 'api_key.created', source: 'platform-governance', subject: { type: 'api_key', id: record.id }, payload: { name: record.name, scopes: dto.scopes ?? [], governed: true }, actorUserId: this.context.context()?.userId });
    return { ...record, key: raw };
  }

  async rotate(id: string) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    await this.ensureTenantKey(id);
    const raw = 'nx_' + randomBytes(32).toString('hex');
    const keyHash = createHash('sha256').update(raw).digest('hex');
    const record = await this.prisma.apiKey.update({ where: { id }, data: { keyHash } });
    await this.events.publish({ tenantId, workspaceId, type: 'api_key.rotated', source: 'platform-governance', subject: { type: 'api_key', id: record.id }, payload: { name: record.name, governed: true }, actorUserId: this.context.context()?.userId });
    return { ...record, key: raw };
  }

  async revoke(id: string) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    await this.ensureTenantKey(id);
    const record = await this.prisma.apiKey.update({ where: { id }, data: { revokedAt: new Date() } });
    await this.events.publish({ tenantId, workspaceId, type: 'api_key.revoked', source: 'platform-governance', subject: { type: 'api_key', id: record.id }, payload: { name: record.name, governed: true }, actorUserId: this.context.context()?.userId });
    return record;
  }

  private async ensureTenantKey(id: string) {
    const record = await this.prisma.apiKey.findFirst({ where: { id, tenantId: this.context.currentTenantId(), deletedAt: null } });
    if (!record) throw new NotFoundException('API key not found');
    return record;
  }
}
