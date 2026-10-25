import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { SavedSearchDto, SearchQueryDto } from '../dto/search.dto';
import { SearchRecord, SecureSearchService } from '../security/secure-search.service';

type SearchDocumentRecord = SearchRecord & {
  sourceType?: string;
  sourceId?: string;
  indexedAt?: Date;
  index?: { indexKey?: string; indexType?: string };
};

@Injectable()
export class KnowledgeSearchService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly secure: SecureSearchService) {}

  globalSearch(query: string, limit?: number) {
    return this.search({ query, searchType: 'global', limit: limit ?? 25 });
  }

  moduleSearch(query: string, moduleKey: string, limit?: number) {
    return this.search({ query, moduleKey, searchType: 'module', limit: limit ?? 25 });
  }

  async search(dto: SearchQueryDto) {
    const startedAt = Date.now();
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const where = { tenantId, workspaceId: workspaceId ?? undefined, moduleKey: dto.moduleKey ?? undefined, sourceType: dto.sourceType ?? undefined, deletedAt: null, OR: this.queryFilter(dto.query) };
    const documents = await this.prisma.searchIndexedDocument.findMany({ where, include: { index: true }, orderBy: { indexedAt: 'desc' }, take: dto.limit ?? 25 }) as SearchDocumentRecord[];
    const secured = this.secure.filterDocuments(documents, dto);
    const latencyMs = Date.now() - startedAt;
    await this.logAndPublish(dto, secured.records.length, secured.filteredCount, latencyMs);
    return { query: dto.query, searchType: dto.searchType ?? 'global', access: this.secure.buildAccessContext(dto), resultCount: secured.records.length, filteredCount: secured.filteredCount, latencyMs, results: secured.records.map((document, rank) => this.toSearchResult(document, rank + 1)) };
  }

  async discovery(query: string) {
    const response = await this.search({ query, searchType: 'discovery', limit: 50 });
    const modules = new Map<string, { moduleKey: string; count: number; topResults: unknown[] }>();
    for (const result of response.results) {
      const moduleKey = result.moduleKey ?? 'global';
      const existing = modules.get(moduleKey) ?? { moduleKey, count: 0, topResults: [] };
      existing.count += 1;
      if (existing.topResults.length < 3) existing.topResults.push(result);
      modules.set(moduleKey, existing);
    }
    return { query, modules: Array.from(modules.values()), totalResults: response.resultCount, filteredCount: response.filteredCount };
  }

  savedSearches() {
    const context = this.context.context();
    return this.prisma.savedSearch.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, OR: [{ ownerUserId: context?.userId }, { visibility: { in: ['workspace', 'tenant'] } }], deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  saveSearch(dto: SavedSearchDto) {
    return this.prisma.savedSearch.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), ownerUserId: this.context.context()?.userId, name: dto.name, query: dto.query, searchScope: dto.searchScope ?? 'global', filters: dto.filters ?? {}, sort: dto.sort ?? {}, visibility: dto.visibility ?? 'private', notifyOnChange: dto.notifyOnChange ?? false, metadata: dto.metadata ?? {} } });
  }

  async runSavedSearch(id: string) {
    const saved = await this.prisma.savedSearch.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!saved) throw new NotFoundException('Saved search not found');
    const result = await this.search({ query: saved.query, workspaceId: saved.workspaceId ?? undefined, searchType: saved.searchScope, filters: saved.filters as Record<string, unknown>, limit: 25 });
    await this.prisma.savedSearch.update({ where: { id }, data: { lastRunAt: new Date() } });
    return { savedSearch: saved, result };
  }

  private queryFilter(query: string) {
    const value = query.trim();
    if (!value) return undefined;
    return [{ title: { contains: value, mode: 'insensitive' } }, { summary: { contains: value, mode: 'insensitive' } }, { searchableText: { contains: value, mode: 'insensitive' } }];
  }

  private async logAndPublish(dto: SearchQueryDto, resultCount: number, sensitiveFilteredCount: number, latencyMs: number) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    await this.prisma.searchQueryLog.create({ data: { tenantId, workspaceId, userId: this.context.context()?.userId, query: dto.query, searchType: dto.searchType ?? 'global', moduleKey: dto.moduleKey, filters: dto.filters ?? {}, resultCount, latencyMs, sensitiveFilteredCount, metadata: { source: 'knowledge-search-engine' } } });
    await this.events.publish({ tenantId, workspaceId, type: 'search.query.executed', source: 'knowledge-search-engine', subject: { type: 'search_query', id: dto.query.slice(0, 64) }, payload: { query: dto.query, searchType: dto.searchType ?? 'global', resultCount, sensitiveFilteredCount, latencyMs }, actorUserId: this.context.context()?.userId });
  }

  private toSearchResult(document: SearchDocumentRecord, rank: number) {
    return { rank, id: document.id, title: document.title, summary: document.summary, moduleKey: document.moduleKey, sourceType: document.sourceType, sourceId: document.sourceId, sensitivityLevel: document.sensitivityLevel, classification: document.classification, indexKey: document.index?.indexKey, indexType: document.index?.indexType, indexedAt: document.indexedAt, metadata: document.metadata };
  }
}