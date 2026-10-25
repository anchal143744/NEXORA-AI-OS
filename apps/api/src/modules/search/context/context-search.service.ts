import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { ContextSearchDto } from '../dto/search.dto';
import { SearchRecord, SecureSearchService } from '../security/secure-search.service';

type KnowledgeNodeRecord = { id: string; entityId: string; nodeType: string; label: string; properties?: unknown; embeddingRef?: string | null };
type KnowledgeEdgeRecord = { id: string; sourceEntityId: string; targetEntityId: string; edgeType: string; weight?: number; properties?: unknown };
type MemoryRecord = { id: string; title: string; memoryType?: string; content?: unknown; importance?: number; source?: string; createdAt?: Date };

@Injectable()
export class ContextSearchService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly secure: SecureSearchService) {}

  workspaceContext(query: string) {
    return this.contextSearch({ query, contextType: 'workspace', includeMemory: true, includeGraph: true, limit: 20 });
  }

  copilotContext(query: string) {
    return this.contextSearch({ query, contextType: 'copilot', includeMemory: true, includeGraph: true, limit: 20, includeSensitive: false });
  }

  agentContext(query: string) {
    return this.contextSearch({ query, contextType: 'agent', includeMemory: true, includeGraph: true, limit: 20 });
  }

  async contextSearch(dto: ContextSearchDto) {
    const startedAt = Date.now();
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const limit = dto.limit ?? 20;
    const documents = await this.prisma.searchIndexedDocument.findMany({ where: { tenantId, workspaceId: workspaceId ?? undefined, moduleKey: dto.moduleKey ?? undefined, deletedAt: null, OR: this.queryFilter(dto.query) }, orderBy: { indexedAt: 'desc' }, take: limit }) as SearchRecord[];
    const secured = this.secure.filterDocuments(documents, dto);
    const [nodes, edges, businessMemory, aiMemory] = await Promise.all([
      dto.includeGraph === false ? Promise.resolve([] as KnowledgeNodeRecord[]) : this.prisma.knowledgeNode.findMany({ where: { tenantId, deletedAt: null, OR: this.nodeQueryFilter(dto.query) }, orderBy: { updatedAt: 'desc' }, take: limit }) as Promise<KnowledgeNodeRecord[]>,
      dto.includeGraph === false ? Promise.resolve([] as KnowledgeEdgeRecord[]) : this.prisma.knowledgeEdge.findMany({ where: { tenantId, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: limit }) as Promise<KnowledgeEdgeRecord[]>,
      dto.includeMemory === false ? Promise.resolve([] as MemoryRecord[]) : this.prisma.businessMemory.findMany({ where: { tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null, OR: this.memoryQueryFilter(dto.query) }, orderBy: { updatedAt: 'desc' }, take: limit }) as Promise<MemoryRecord[]>,
      dto.includeMemory === false ? Promise.resolve([] as MemoryRecord[]) : this.prisma.aiMemory.findMany({ where: { tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null, OR: this.memoryQueryFilter(dto.query) }, orderBy: [{ importance: 'desc' }, { updatedAt: 'desc' }], take: limit }) as Promise<MemoryRecord[]>,
    ]);
    const latencyMs = Date.now() - startedAt;
    await this.logAndPublish(dto, secured.records.length + nodes.length + businessMemory.length + aiMemory.length, secured.filteredCount, latencyMs);
    return {
      query: dto.query,
      contextType: dto.contextType ?? 'workspace',
      access: this.secure.buildAccessContext(dto),
      latencyMs,
      filteredCount: secured.filteredCount,
      context: {
        documents: secured.records.map((record, rank) => ({ rank: rank + 1, id: record.id, title: record.title, summary: record.summary, moduleKey: record.moduleKey, sourceType: 'search_indexed_document', sensitivityLevel: record.sensitivityLevel })),
        graph: { nodes: nodes.map((node) => ({ id: node.id, entityId: node.entityId, type: node.nodeType, label: node.label, embeddingRef: node.embeddingRef, properties: node.properties })), edges: edges.map((edge) => ({ id: edge.id, sourceEntityId: edge.sourceEntityId, targetEntityId: edge.targetEntityId, type: edge.edgeType, weight: edge.weight, properties: edge.properties })) },
        memory: { business: businessMemory.map((memory) => this.toMemoryContext(memory)), ai: aiMemory.map((memory) => this.toMemoryContext(memory)) },
      },
      aiReady: { tokensEstimated: this.estimateTokens(secured.records, nodes, businessMemory, aiMemory), sources: ['search_indexed_documents', 'knowledge_graph', 'business_memory', 'ai_memory'] },
    };
  }

  private queryFilter(query: string) {
    const value = query.trim();
    if (!value) return undefined;
    return [{ title: { contains: value, mode: 'insensitive' } }, { summary: { contains: value, mode: 'insensitive' } }, { searchableText: { contains: value, mode: 'insensitive' } }];
  }

  private nodeQueryFilter(query: string) {
    const value = query.trim();
    if (!value) return undefined;
    return [{ label: { contains: value, mode: 'insensitive' } }, { nodeType: { contains: value, mode: 'insensitive' } }];
  }

  private memoryQueryFilter(query: string) {
    const value = query.trim();
    if (!value) return undefined;
    return [{ title: { contains: value, mode: 'insensitive' } }, { memoryType: { contains: value, mode: 'insensitive' } }];
  }

  private async logAndPublish(dto: ContextSearchDto, resultCount: number, sensitiveFilteredCount: number, latencyMs: number) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    await this.prisma.searchQueryLog.create({ data: { tenantId, workspaceId, userId: this.context.context()?.userId, query: dto.query, searchType: dto.contextType ?? 'context', moduleKey: dto.moduleKey, filters: dto.filters ?? {}, resultCount, latencyMs, sensitiveFilteredCount, metadata: { includeMemory: dto.includeMemory ?? true, includeGraph: dto.includeGraph ?? true } } });
    await this.events.publish({ tenantId, workspaceId, type: 'retrieval.context.generated', source: 'context-retrieval-engine', subject: { type: 'context_search', id: dto.query.slice(0, 64) }, payload: { query: dto.query, contextType: dto.contextType ?? 'workspace', resultCount, sensitiveFilteredCount, latencyMs }, actorUserId: this.context.context()?.userId });
  }

  private toMemoryContext(memory: MemoryRecord) {
    return { id: memory.id, title: memory.title, memoryType: memory.memoryType, source: memory.source, importance: memory.importance, content: memory.content, createdAt: memory.createdAt };
  }

  private estimateTokens(documents: SearchRecord[], nodes: KnowledgeNodeRecord[], businessMemory: MemoryRecord[], aiMemory: MemoryRecord[]) {
    const text = [documents.map((item) => `${item.title ?? ''} ${item.summary ?? ''}`).join(' '), nodes.map((node) => node.label).join(' '), businessMemory.map((memory) => memory.title).join(' '), aiMemory.map((memory) => memory.title).join(' ')].join(' ');
    return Math.ceil(text.length / 4);
  }
}