import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { SemanticSearchDto } from '../dto/search.dto';
import { SearchRecord, SecureSearchService } from '../security/secure-search.service';

type SemanticRecord = SearchRecord & {
  sourceType?: string;
  sourceId?: string;
  indexedAt?: Date;
  embeddings?: Array<{ model?: string; provider?: string; vectorRef?: string | null; chunkText?: string | null }>;
};

@Injectable()
export class SemanticSearchService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly secure: SecureSearchService) {}

  semanticSearch(dto: SemanticSearchDto) {
    return this.executeSemanticSearch({ ...dto, searchType: 'semantic' });
  }

  entitySearch(query: string, entityType?: string) {
    return this.executeSemanticSearch({ query, sourceType: entityType, entityType, searchType: 'semantic', limit: 25 });
  }

  moduleSemantic(query: string, moduleKey: string) {
    return this.executeSemanticSearch({ query, moduleKey, searchType: 'semantic', limit: 25 });
  }

  private async executeSemanticSearch(dto: SemanticSearchDto) {
    const startedAt = Date.now();
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const records = await this.prisma.searchIndexedDocument.findMany({ where: { tenantId, workspaceId: workspaceId ?? undefined, moduleKey: dto.moduleKey ?? undefined, sourceType: dto.sourceType ?? dto.entityType ?? undefined, deletedAt: null, OR: this.queryFilter(dto.query) }, include: { embeddings: { where: { model: dto.embeddingModel ?? undefined, deletedAt: null }, take: 3 } }, orderBy: { indexedAt: 'desc' }, take: Math.max(dto.limit ?? 25, 50) }) as SemanticRecord[];
    const secured = this.secure.filterDocuments(records, dto);
    const scored = secured.records.map((record) => ({ record, score: this.lexicalScore(dto.query, record) })).sort((a, b) => b.score - a.score).slice(0, dto.limit ?? 25);
    const latencyMs = Date.now() - startedAt;
    await this.logAndPublish(dto, scored.length, secured.filteredCount, latencyMs);
    return { query: dto.query, searchType: 'semantic', embeddingModel: dto.embeddingModel, resultCount: scored.length, filteredCount: secured.filteredCount, latencyMs, access: this.secure.buildAccessContext(dto), results: scored.map((item, index) => this.toSemanticResult(item.record, item.score, index + 1)) };
  }

  private queryFilter(query: string) {
    const value = query.trim();
    if (!value) return undefined;
    return [{ title: { contains: value, mode: 'insensitive' } }, { summary: { contains: value, mode: 'insensitive' } }, { searchableText: { contains: value, mode: 'insensitive' } }];
  }

  private lexicalScore(query: string, record: SemanticRecord) {
    const tokens = this.tokens(query);
    const corpus = this.tokens([record.title, record.summary, record.searchableText, ...(record.embeddings ?? []).map((embedding) => embedding.chunkText)].filter(Boolean).join(' '));
    if (tokens.length === 0 || corpus.length === 0) return 0;
    const corpusSet = new Set(corpus);
    const matches = tokens.filter((token) => corpusSet.has(token)).length;
    const titleBoost = record.title && tokens.some((token) => record.title?.toLowerCase().includes(token)) ? 0.2 : 0;
    return Number(((matches / tokens.length) + titleBoost).toFixed(4));
  }

  private tokens(value: string) {
    return value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2);
  }

  private async logAndPublish(dto: SemanticSearchDto, resultCount: number, sensitiveFilteredCount: number, latencyMs: number) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    await this.prisma.searchQueryLog.create({ data: { tenantId, workspaceId, userId: this.context.context()?.userId, query: dto.query, searchType: 'semantic', moduleKey: dto.moduleKey, filters: dto.filters ?? {}, resultCount, latencyMs, sensitiveFilteredCount, metadata: { embeddingModel: dto.embeddingModel, includeKnowledgeGraph: dto.includeKnowledgeGraph ?? false } } });
    await this.events.publish({ tenantId, workspaceId, type: 'search.semantic.executed', source: 'semantic-search-engine', subject: { type: 'semantic_search', id: dto.query.slice(0, 64) }, payload: { query: dto.query, moduleKey: dto.moduleKey, resultCount, sensitiveFilteredCount, latencyMs }, actorUserId: this.context.context()?.userId });
  }

  private toSemanticResult(record: SemanticRecord, score: number, rank: number) {
    return { rank, score, id: record.id, title: record.title, summary: record.summary, moduleKey: record.moduleKey, sourceType: record.sourceType, sourceId: record.sourceId, sensitivityLevel: record.sensitivityLevel, classification: record.classification, embeddings: record.embeddings?.map((embedding) => ({ provider: embedding.provider, model: embedding.model, vectorRef: embedding.vectorRef })) ?? [], metadata: record.metadata };
  }
}