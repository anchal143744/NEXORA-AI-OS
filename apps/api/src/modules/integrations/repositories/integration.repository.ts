import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
@Injectable()
export class IntegrationRepository { constructor(private readonly prisma: PrismaService) {}
  async ensureProvider(input: { key: string; name: string; category: string; configSchema?: Record<string, unknown> }) { const found = await this.prisma.integrationProvider.findFirst({ where: { key: input.key, deletedAt: null } }); if (found) return found; return this.prisma.integrationProvider.create({ data: { key: input.key, name: input.name, category: input.category, configSchema: input.configSchema ?? {} } }); }
  createIntegration(input: { tenantId: string; providerId: string; name: string; credentialsRef?: string; settings?: Record<string, unknown> }) { return this.prisma.integration.create({ data: { tenantId: input.tenantId, providerId: input.providerId, name: input.name, credentialsRef: input.credentialsRef, settings: input.settings ?? {}, status: 'CONNECTED' } }); }
  list(tenantId: string) { return this.prisma.integration.findMany({ where: { tenantId, deletedAt: null }, include: { provider: true }, orderBy: { createdAt: 'desc' } }); }
  async get(tenantId: string, id: string) { const row = await this.prisma.integration.findFirst({ where: { tenantId, id, deletedAt: null }, include: { provider: true } }); if (!row) throw new NotFoundException('Integration not found'); return row; }
  update(id: string, data: Record<string, unknown>) { return this.prisma.integration.update({ where: { id }, data }); }
  createSecret(input: { tenantId: string; integrationId?: string; kind: string; encryptedValue: string; fingerprint: string; expiresAt?: Date }) { return this.prisma.integrationSecret.create({ data: input }); }
  latestSecret(tenantId: string, integrationId: string, kind: string) { return this.prisma.integrationSecret.findFirst({ where: { tenantId, integrationId, kind, revokedAt: null, deletedAt: null }, orderBy: { createdAt: 'desc' } }); }
}
