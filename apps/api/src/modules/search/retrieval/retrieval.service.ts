import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { ContextSearchService } from '../context/context-search.service';
import { RetrievalRequestDto } from '../dto/search.dto';
import { SemanticSearchService } from '../semantic/semantic-search.service';
import { SecureSearchService } from '../security/secure-search.service';

type SemanticResult = { id: string; title?: string | null; summary?: string | null; score?: number; rank?: number; moduleKey?: string | null; sourceType?: string; sourceId?: string; sensitivityLevel?: string | null; metadata?: unknown };

@Injectable()
export class RetrievalService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly semantic: SemanticSearchService, private readonly contextSearch: ContextSearchService, private readonly secure: SecureSearchService) {}

  retrieve(dto: RetrievalRequestDto) {
    return this.createRetrievalSession({ ...dto, retrievalType: dto.retrievalType ?? 'semantic' });
  }

  copilotRetrieval(dto: RetrievalRequestDto) {
    return this.createRetrievalSession({ ...dto, retrievalType: 'copilot', includeMemory: true, includeGraph: true, maxResults: dto.maxResults ?? 12, aiReady: true });
  }

  agentRetrieval(dto: RetrievalRequestDto) {
    return this.createRetrievalSession({ ...dto, retrievalType: 'agent', includeMemory: true, includeGraph: true, maxResults: dto.maxResults ?? 12, aiReady: true });
  }

  sessions() {
    return this.prisma.retrievalSession.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, include: { results: { where: { deletedAt: null }, orderBy: { rank: 'asc' }, take: 5 } }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async results(sessionId: string) {
    const session = await this.requireSession(sessionId);
    const results = await this.prisma.retrievalResult.findMany({ where: { tenantId: this.context.currentTenantId(), sessionId: session.id, deletedAt: null }, orderBy: { rank: 'asc' } });
    return { session, results };
  }

  private async createRetrievalSession(dto: RetrievalRequestDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const maxResults = dto.maxResults ?? dto.limit ?? 10;
    const [semantic, contextPackage] = await Promise.all([
      this.semantic.semanticSearch({ ...dto, searchType: 'semantic', limit: maxResults }),
      this.contextSearch.contextSearch({ ...dto, contextType: dto.retrievalType ?? 'context', limit: maxResults }),
    ]);
    const session = await this.prisma.retrievalSession.create({ data: { tenantId, workspaceId, userId: this.context.context()?.userId, sessionKey: dto.sessionKey ?? `retrieval-${randomUUID()}`, retrievalType: dto.retrievalType ?? 'semantic', query: dto.query, context: { access: this.secure.buildAccessContext(dto), context: contextPackage.context, aiReady: contextPackage.aiReady }, status: 'completed', aiReady: dto.aiReady ?? true, maxResults, metadata: { filteredCount: semantic.filteredCount + contextPackage.filteredCount, sourceCount: semantic.resultCount } } });
    const resultRows = (semantic.results as SemanticResult[]).slice(0, maxResults).map((result, index) => ({ tenantId, workspaceId, sessionId: session.id, sourceType: result.sourceType ?? 'search_indexed_document', sourceId: result.sourceId ?? result.id, title: result.title ?? 'Untitled knowledge result', snippet: result.summary, score: result.score ?? 0, rank: index + 1, sensitivityLevel: result.sensitivityLevel ?? 'internal', allowed: true, context: { moduleKey: result.moduleKey, semanticRank: result.rank, semanticScore: result.score }, citations: [{ sourceType: result.sourceType ?? 'search_indexed_document', sourceId: result.sourceId ?? result.id, title: result.title }], metadata: { moduleKey: result.moduleKey, sourceMetadata: result.metadata ?? {} } }));
    if (resultRows.length > 0) await this.prisma.retrievalResult.createMany({ data: resultRows });
    const results = await this.prisma.retrievalResult.findMany({ where: { tenantId, sessionId: session.id, deletedAt: null }, orderBy: { rank: 'asc' } });
    await this.events.publish({ tenantId, workspaceId, type: 'retrieval.session.created', source: 'secure-retrieval-engine', subject: { type: 'retrieval_session', id: session.id }, payload: { query: dto.query, retrievalType: session.retrievalType, resultCount: results.length, aiReady: session.aiReady }, actorUserId: this.context.context()?.userId });
    return { session, context: contextPackage.context, aiReady: contextPackage.aiReady, results };
  }

  private async requireSession(id: string) {
    const session = await this.prisma.retrievalSession.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!session) throw new NotFoundException('Retrieval session not found');
    return session;
  }
}