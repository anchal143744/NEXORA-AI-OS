import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateAccessPolicyDto, CreateEmbeddingDto, CreateSearchIndexDto, IndexDocumentDto, RebuildIndexDto } from '../dto/search.dto';

@Injectable()
export class SearchIndexService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  listIndexes(indexType?: string, moduleKey?: string) {
    return this.prisma.searchIndex.findMany({ where: { tenantId: this.context.currentTenantId(), indexType: indexType ?? undefined, moduleKey: moduleKey ?? undefined, deletedAt: null }, include: { _count: { select: { documents: true, embeddings: true, accessPolicies: true } } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createIndex(dto: CreateSearchIndexDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const index = await this.prisma.searchIndex.create({ data: { tenantId, workspaceId, indexKey: dto.indexKey ?? `search-${randomUUID()}`, name: dto.name, indexType: dto.indexType, moduleKey: dto.moduleKey, entityType: dto.entityType, embeddingProvider: dto.embeddingProvider, embeddingModel: dto.embeddingModel, dimension: dto.dimension, sensitivityLevel: dto.sensitivityLevel ?? 'internal', accessPolicy: dto.accessPolicy ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'search.index.created', source: 'knowledge-search-engine', subject: { type: 'search_index', id: index.id }, payload: { indexKey: index.indexKey, indexType: index.indexType, moduleKey: index.moduleKey }, actorUserId: this.context.context()?.userId });
    return index;
  }

  async indexDocument(indexId: string, dto: IndexDocumentDto) {
    const tenantId = this.context.currentTenantId();
    const index = await this.requireIndex(indexId);
    const workspaceId = dto.workspaceId ?? index.workspaceId ?? this.context.currentWorkspaceId();
    const searchableText = dto.searchableText ?? [dto.title, dto.summary].filter(Boolean).join('\n');
    const existing = await this.prisma.searchIndexedDocument.findFirst({ where: { tenantId, indexId, sourceType: dto.sourceType, sourceId: dto.sourceId, deletedAt: null } });
    const document = existing
      ? await this.prisma.searchIndexedDocument.update({ where: { id: existing.id }, data: { workspaceId, moduleKey: dto.moduleKey, title: dto.title, summary: dto.summary, contentHash: dto.contentHash, language: dto.language ?? 'en', sensitivityLevel: dto.sensitivityLevel ?? 'internal', classification: dto.classification ?? 'internal', permissions: dto.permissions ?? {}, searchableText, metadata: dto.metadata ?? {}, indexedAt: new Date() } })
      : await this.prisma.searchIndexedDocument.create({ data: { tenantId, workspaceId, indexId, sourceType: dto.sourceType, sourceId: dto.sourceId, moduleKey: dto.moduleKey, title: dto.title, summary: dto.summary, contentHash: dto.contentHash, language: dto.language ?? 'en', sensitivityLevel: dto.sensitivityLevel ?? 'internal', classification: dto.classification ?? 'internal', permissions: dto.permissions ?? {}, searchableText, metadata: dto.metadata ?? {} } });
    await this.prisma.searchIndex.update({ where: { id: indexId }, data: { lastIndexedAt: new Date() } });
    await this.events.publish({ tenantId, workspaceId, type: 'search.document.indexed', source: 'semantic-indexing-engine', subject: { type: 'search_indexed_document', id: document.id }, payload: { indexId, sourceType: document.sourceType, sourceId: document.sourceId, moduleKey: document.moduleKey, classification: document.classification }, actorUserId: this.context.context()?.userId });
    return document;
  }

  async createEmbedding(indexId: string, dto: CreateEmbeddingDto) {
    const tenantId = this.context.currentTenantId();
    const index = await this.requireIndex(indexId);
    if (dto.documentId) await this.requireDocument(dto.documentId);
    return this.prisma.searchEmbeddingRecord.create({ data: { tenantId, workspaceId: index.workspaceId ?? this.context.currentWorkspaceId(), indexId, documentId: dto.documentId, embeddingKey: dto.embeddingKey ?? `embedding-${randomUUID()}`, provider: dto.provider, model: dto.model, dimensions: dto.dimensions, vectorRef: dto.vectorRef, vectorHash: dto.vectorHash, chunkText: dto.chunkText, chunkIndex: dto.chunkIndex ?? 0, tokenCount: dto.tokenCount ?? 0, metadata: dto.metadata ?? {} } });
  }

  async rebuildIndex(indexId: string, dto: RebuildIndexDto) {
    const index = await this.requireIndex(indexId);
    const metadata = { ...(index.metadata ?? {}), rebuild: { force: dto.force ?? false, moduleKeys: dto.moduleKeys ?? [], requestedAt: new Date().toISOString(), requestedBy: this.context.context()?.userId, metadata: dto.metadata ?? {} } };
    return this.prisma.searchIndex.update({ where: { id: indexId }, data: { status: 'rebuild_requested', metadata } });
  }

  async documents(indexId: string) {
    await this.requireIndex(indexId);
    return this.prisma.searchIndexedDocument.findMany({ where: { tenantId: this.context.currentTenantId(), indexId, deletedAt: null }, orderBy: { indexedAt: 'desc' }, take: 100 });
  }

  async embeddings(indexId: string) {
    await this.requireIndex(indexId);
    return this.prisma.searchEmbeddingRecord.findMany({ where: { tenantId: this.context.currentTenantId(), indexId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  policies(indexId?: string) {
    return this.prisma.searchAccessPolicy.findMany({ where: { tenantId: this.context.currentTenantId(), indexId: indexId ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createPolicy(dto: CreateAccessPolicyDto) {
    const tenantId = this.context.currentTenantId();
    if (dto.indexId) await this.requireIndex(dto.indexId);
    return this.prisma.searchAccessPolicy.create({ data: { tenantId, workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), indexId: dto.indexId, policyKey: dto.policyKey ?? `search-policy-${randomUUID()}`, name: dto.name, moduleKey: dto.moduleKey, roleKeys: dto.roleKeys ?? [], permissionKeys: dto.permissionKeys ?? [], sensitivityThreshold: dto.sensitivityThreshold ?? 'confidential', filterRules: dto.filterRules ?? {}, maskingRules: dto.maskingRules ?? {}, enabled: dto.enabled ?? true, metadata: dto.metadata ?? {} } });
  }

  private async requireIndex(id: string) {
    const index = await this.prisma.searchIndex.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!index) throw new NotFoundException('Search index not found');
    return index;
  }

  private async requireDocument(id: string) {
    const document = await this.prisma.searchIndexedDocument.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!document) throw new NotFoundException('Search indexed document not found');
    return document;
  }
}