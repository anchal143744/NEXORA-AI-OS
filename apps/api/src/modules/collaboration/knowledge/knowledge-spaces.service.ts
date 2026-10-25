import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CollaborationFeedService } from '../collaboration-feed.service';
import { CollaborationIndexService } from '../collaboration-index.service';
import { CreateKnowledgeArticleDto, CreateKnowledgeCategoryDto, CreateKnowledgeSpaceDto, PublishKnowledgeArticleDto, UpdateKnowledgeSpaceDto } from '../dto/collaboration.dto';

@Injectable()
export class KnowledgeSpacesService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly feed: CollaborationFeedService, private readonly indexer: CollaborationIndexService) {}

  spaces(spaceType?: string) {
    return this.prisma.knowledgeSpace.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, spaceType: spaceType ?? undefined, deletedAt: null }, include: { _count: { select: { categories: true, articles: true, discussions: true, decisionRooms: true } } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createSpace(dto: CreateKnowledgeSpaceDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const space = await this.prisma.knowledgeSpace.create({ data: { tenantId, workspaceId, spaceKey: dto.spaceKey ?? `space-${randomUUID()}`, name: dto.name, description: dto.description, spaceType: dto.spaceType, visibility: dto.visibility ?? 'workspace', ownerUserId: dto.ownerUserId ?? this.context.context()?.userId, departmentId: dto.departmentId, projectId: dto.projectId, permissions: dto.permissions ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'knowledge.space.created', source: 'knowledge-spaces-engine', subject: { type: 'knowledge_space', id: space.id }, payload: { name: space.name, spaceType: space.spaceType, visibility: space.visibility }, actorUserId: this.context.context()?.userId });
    await this.feed.recordActivity({ workspaceId, spaceId: space.id, actorUserId: this.context.context()?.userId, activityType: 'knowledge_space.created', subjectType: 'knowledge_space', subjectId: space.id, description: space.name, payload: { spaceType: space.spaceType } });
    return space;
  }

  async getSpace(id: string) {
    const space = await this.prisma.knowledgeSpace.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { categories: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } }, articles: { where: { deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 20 }, discussions: { where: { deletedAt: null }, orderBy: { lastActivityAt: 'desc' }, take: 20 }, decisionRooms: { where: { deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 20 } } });
    if (!space) throw new NotFoundException('Knowledge space not found');
    return space;
  }

  async updateSpace(id: string, dto: UpdateKnowledgeSpaceDto) {
    await this.requireSpace(id);
    return this.prisma.knowledgeSpace.update({ where: { id }, data: { name: dto.name, description: dto.description, visibility: dto.visibility, status: dto.status, permissions: dto.permissions, metadata: dto.metadata } });
  }

  async spaceActivity(id: string) {
    await this.requireSpace(id);
    return this.feed.activity(id);
  }

  async categories(spaceId: string) {
    await this.requireSpace(spaceId);
    return this.prisma.knowledgeCategory.findMany({ where: { tenantId: this.context.currentTenantId(), spaceId, deletedAt: null }, include: { children: { where: { deletedAt: null } }, _count: { select: { articles: true } } }, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  }

  async createCategory(spaceId: string, dto: CreateKnowledgeCategoryDto) {
    const space = await this.requireSpace(spaceId);
    return this.prisma.knowledgeCategory.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? space.workspaceId ?? this.context.currentWorkspaceId(), spaceId, parentCategoryId: dto.parentCategoryId, categoryKey: dto.categoryKey ?? `category-${randomUUID()}`, name: dto.name, description: dto.description, sortOrder: dto.sortOrder ?? 0, metadata: dto.metadata ?? {} } });
  }

  articles(spaceId?: string, status?: string) {
    return this.prisma.knowledgeArticle.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, spaceId: spaceId ?? undefined, status: status ?? undefined, deletedAt: null }, include: { space: true, category: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createArticle(dto: CreateKnowledgeArticleDto) {
    const tenantId = this.context.currentTenantId();
    const space = dto.spaceId ? await this.requireSpace(dto.spaceId) : undefined;
    const workspaceId = dto.workspaceId ?? space?.workspaceId ?? this.context.currentWorkspaceId();
    const article = await this.prisma.knowledgeArticle.create({ data: { tenantId, workspaceId, spaceId: dto.spaceId, categoryId: dto.categoryId, articleKey: dto.articleKey ?? `article-${randomUUID()}`, title: dto.title, summary: dto.summary, content: dto.content ?? {}, contentText: dto.contentText, status: dto.status ?? 'draft', authorUserId: dto.authorUserId ?? this.context.context()?.userId, reviewerUserId: dto.reviewerUserId, tags: dto.tags ?? [], metadata: dto.metadata ?? {} } });
    await this.indexer.indexRecord({ sourceType: 'knowledge_article', sourceId: article.id, moduleKey: 'knowledge', title: article.title, summary: article.summary ?? undefined, searchableText: article.contentText ?? article.summary ?? article.title, workspaceId: article.workspaceId, metadata: { articleKey: article.articleKey, status: article.status, tags: article.tags } });
    await this.events.publish({ tenantId, workspaceId, type: 'knowledge.article.created', source: 'knowledge-spaces-engine', subject: { type: 'knowledge_article', id: article.id }, payload: { title: article.title, status: article.status, spaceId: article.spaceId }, actorUserId: this.context.context()?.userId });
    await this.feed.recordActivity({ workspaceId, spaceId: article.spaceId, actorUserId: this.context.context()?.userId, activityType: 'knowledge_article.created', subjectType: 'knowledge_article', subjectId: article.id, description: article.title, payload: { status: article.status } });
    return article;
  }

  async getArticle(id: string) {
    const article = await this.prisma.knowledgeArticle.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { space: true, category: true } });
    if (!article) throw new NotFoundException('Knowledge article not found');
    return article;
  }

  async publishArticle(id: string, dto: PublishKnowledgeArticleDto) {
    const article = await this.getArticle(id);
    const next = await this.prisma.knowledgeArticle.update({ where: { id }, data: { status: dto.status ?? 'published', reviewerUserId: dto.reviewerUserId ?? article.reviewerUserId, publishedAt: new Date(), version: article.version + 1 } });
    await this.indexer.indexRecord({ sourceType: 'knowledge_article', sourceId: next.id, moduleKey: 'knowledge', title: next.title, summary: next.summary ?? undefined, searchableText: next.contentText ?? next.summary ?? next.title, workspaceId: next.workspaceId, metadata: { articleKey: next.articleKey, status: next.status, version: next.version } });
    return next;
  }

  searchKnowledge(query: string) {
    const value = query.trim();
    return this.prisma.knowledgeArticle.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null, OR: value ? [{ title: { contains: value, mode: 'insensitive' } }, { summary: { contains: value, mode: 'insensitive' } }, { contentText: { contains: value, mode: 'insensitive' } }] : undefined }, include: { space: true, category: true }, orderBy: { updatedAt: 'desc' }, take: 50 });
  }

  private async requireSpace(id: string) {
    const space = await this.prisma.knowledgeSpace.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!space) throw new NotFoundException('Knowledge space not found');
    return space;
  }
}