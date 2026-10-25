import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';

export type CollaborationIndexRecord = {
  sourceType: string;
  sourceId: string;
  moduleKey: string;
  title: string;
  summary?: string;
  searchableText?: string;
  workspaceId?: string | null;
  sensitivityLevel?: string;
  classification?: string;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class CollaborationIndexService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  async indexRecord(record: CollaborationIndexRecord) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = record.workspaceId ?? this.context.currentWorkspaceId();
    const index = await this.ensureIndex(workspaceId ?? undefined);
    const existing = await this.prisma.searchIndexedDocument.findFirst({ where: { tenantId, indexId: index.id, sourceType: record.sourceType, sourceId: record.sourceId, deletedAt: null } });
    const data = { workspaceId, moduleKey: record.moduleKey, title: record.title, summary: record.summary, language: 'en', sensitivityLevel: record.sensitivityLevel ?? 'internal', classification: record.classification ?? 'internal', permissions: {}, searchableText: record.searchableText ?? [record.title, record.summary].filter(Boolean).join('\n'), metadata: record.metadata ?? {}, indexedAt: new Date() };
    if (existing) return this.prisma.searchIndexedDocument.update({ where: { id: existing.id }, data });
    return this.prisma.searchIndexedDocument.create({ data: { tenantId, indexId: index.id, sourceType: record.sourceType, sourceId: record.sourceId, ...data } });
  }

  private async ensureIndex(workspaceId?: string) {
    const tenantId = this.context.currentTenantId();
    const existing = await this.prisma.searchIndex.findFirst({ where: { tenantId, indexKey: 'collaboration-knowledge', deletedAt: null } });
    if (existing) return existing;
    return this.prisma.searchIndex.create({ data: { tenantId, workspaceId, indexKey: 'collaboration-knowledge', name: 'Collaboration Knowledge Index', indexType: 'semantic', moduleKey: 'collaboration', entityType: 'collaboration_record', embeddingProvider: 'provider_agnostic', embeddingModel: 'metadata_first', dimension: 1536, sensitivityLevel: 'internal', accessPolicy: { tenantScoped: true, workspaceScoped: true, rbacAware: true }, metadata: { phase: 25, purpose: 'knowledge spaces, discussions and decision rooms' } } });
  }
}