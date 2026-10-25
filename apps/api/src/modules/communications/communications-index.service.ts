import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';

export type CommunicationsIndexRecord = {
  sourceType: string;
  sourceId: string;
  moduleKey: string;
  title: string;
  summary?: string;
  searchableText?: string;
  workspaceId?: string | null;
  sensitivityLevel?: string;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class CommunicationsIndexService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  async indexRecord(record: CommunicationsIndexRecord) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = record.workspaceId ?? this.context.currentWorkspaceId();
    const index = await this.ensureIndex(workspaceId ?? undefined);
    const existing = await this.prisma.searchIndexedDocument.findFirst({ where: { tenantId, indexId: index.id, sourceType: record.sourceType, sourceId: record.sourceId, deletedAt: null } });
    const data = { workspaceId, moduleKey: record.moduleKey, title: record.title, summary: record.summary, language: 'en', sensitivityLevel: record.sensitivityLevel ?? 'internal', classification: 'internal', permissions: {}, searchableText: record.searchableText ?? [record.title, record.summary].filter(Boolean).join('\n'), metadata: record.metadata ?? {}, indexedAt: new Date() };
    if (existing) return this.prisma.searchIndexedDocument.update({ where: { id: existing.id }, data });
    return this.prisma.searchIndexedDocument.create({ data: { tenantId, indexId: index.id, sourceType: record.sourceType, sourceId: record.sourceId, ...data } });
  }

  private async ensureIndex(workspaceId?: string) {
    const tenantId = this.context.currentTenantId();
    const existing = await this.prisma.searchIndex.findFirst({ where: { tenantId, indexKey: 'communications-meetings-calendar', deletedAt: null } });
    if (existing) return existing;
    return this.prisma.searchIndex.create({ data: { tenantId, workspaceId, indexKey: 'communications-meetings-calendar', name: 'Communications Meetings Calendar Index', indexType: 'semantic', moduleKey: 'communications', entityType: 'communications_record', embeddingProvider: 'provider_agnostic', embeddingModel: 'metadata_first', dimension: 1536, sensitivityLevel: 'internal', accessPolicy: { tenantScoped: true, workspaceScoped: true, rbacAware: true }, metadata: { phase: 26, purpose: 'communications, meetings and calendar intelligence' } } });
  }
}