import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CollaborationFeedService } from '../collaboration-feed.service';
import { CollaborationIndexService } from '../collaboration-index.service';
import { CreateDiscussionDto, CreateMentionDto, CreateMessageDto, CreateReactionDto, CreateThreadDto } from '../dto/collaboration.dto';

@Injectable()
export class DiscussionsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly feed: CollaborationFeedService, private readonly indexer: CollaborationIndexService) {}

  discussions(status?: string, spaceId?: string) {
    return this.prisma.discussion.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, spaceId: spaceId ?? undefined, deletedAt: null }, include: { space: true, _count: { select: { threads: true, messages: true } } }, orderBy: { lastActivityAt: 'desc' }, take: 100 });
  }

  async createDiscussion(dto: CreateDiscussionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const discussion = await this.prisma.discussion.create({ data: { tenantId, workspaceId, spaceId: dto.spaceId, discussionKey: dto.discussionKey ?? `discussion-${randomUUID()}`, title: dto.title, topicType: dto.topicType ?? 'general', sourceType: dto.sourceType, sourceId: dto.sourceId, visibility: dto.visibility ?? 'workspace', createdByUserId: dto.createdByUserId ?? this.context.context()?.userId, lastActivityAt: new Date(), metadata: dto.metadata ?? {} } });
    await this.indexer.indexRecord({ sourceType: 'discussion', sourceId: discussion.id, moduleKey: 'collaboration', title: discussion.title, summary: discussion.topicType, searchableText: `${discussion.title} ${discussion.topicType}`, workspaceId: discussion.workspaceId, metadata: { discussionKey: discussion.discussionKey, status: discussion.status } });
    await this.events.publish({ tenantId, workspaceId, type: 'discussion.created', source: 'collaboration-engine', subject: { type: 'discussion', id: discussion.id }, payload: { title: discussion.title, topicType: discussion.topicType, spaceId: discussion.spaceId }, actorUserId: this.context.context()?.userId });
    await this.feed.recordActivity({ workspaceId, spaceId: discussion.spaceId, actorUserId: this.context.context()?.userId, activityType: 'discussion.created', subjectType: 'discussion', subjectId: discussion.id, description: discussion.title, payload: { topicType: discussion.topicType } });
    return discussion;
  }

  async getDiscussion(id: string) {
    const discussion = await this.prisma.discussion.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { space: true, threads: { where: { deletedAt: null }, orderBy: { lastActivityAt: 'desc' } }, messages: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 50 } } });
    if (!discussion) throw new NotFoundException('Discussion not found');
    return discussion;
  }

  async createThread(discussionId: string, dto: CreateThreadDto) {
    const discussion = await this.requireDiscussion(discussionId);
    const thread = await this.prisma.discussionThread.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? discussion.workspaceId ?? this.context.currentWorkspaceId(), discussionId, parentThreadId: dto.parentThreadId, threadKey: dto.threadKey ?? `thread-${randomUUID()}`, title: dto.title, createdByUserId: dto.createdByUserId ?? this.context.context()?.userId, lastActivityAt: new Date(), metadata: dto.metadata ?? {} } });
    await this.prisma.discussion.update({ where: { id: discussionId }, data: { lastActivityAt: new Date() } });
    await this.feed.recordActivity({ workspaceId: thread.workspaceId, spaceId: discussion.spaceId, actorUserId: this.context.context()?.userId, activityType: 'discussion_thread.created', subjectType: 'discussion_thread', subjectId: thread.id, description: thread.title, payload: { discussionId } });
    return thread;
  }

  async createMessage(discussionId: string, dto: CreateMessageDto) {
    const discussion = await this.requireDiscussion(discussionId);
    if (dto.threadId) await this.requireThread(dto.threadId);
    const workspaceId = dto.workspaceId ?? discussion.workspaceId ?? this.context.currentWorkspaceId();
    const message = await this.prisma.discussionMessage.create({ data: { tenantId: this.context.currentTenantId(), workspaceId, discussionId, threadId: dto.threadId, authorUserId: dto.authorUserId ?? this.context.context()?.userId, messageType: dto.messageType ?? 'comment', body: dto.body, content: dto.content ?? {}, metadata: dto.metadata ?? {} } });
    await Promise.all([this.prisma.discussion.update({ where: { id: discussionId }, data: { lastActivityAt: new Date() } }), dto.threadId ? this.prisma.discussionThread.update({ where: { id: dto.threadId }, data: { lastActivityAt: new Date() } }) : Promise.resolve()]);
    await this.indexer.indexRecord({ sourceType: 'discussion_message', sourceId: message.id, moduleKey: 'collaboration', title: discussion.title, summary: message.body ?? undefined, searchableText: message.body ?? discussion.title, workspaceId, metadata: { discussionId, threadId: message.threadId, messageType: message.messageType } });
    await this.events.publish({ tenantId: this.context.currentTenantId(), workspaceId, type: 'discussion.message.created', source: 'collaboration-engine', subject: { type: 'discussion_message', id: message.id }, payload: { discussionId, threadId: message.threadId, messageType: message.messageType }, actorUserId: this.context.context()?.userId });
    await this.feed.recordActivity({ workspaceId, spaceId: discussion.spaceId, actorUserId: this.context.context()?.userId, activityType: 'discussion_message.created', subjectType: 'discussion_message', subjectId: message.id, description: message.body?.slice(0, 120), payload: { discussionId } });
    return message;
  }

  async messages(discussionId: string, threadId?: string) {
    await this.requireDiscussion(discussionId);
    return this.prisma.discussionMessage.findMany({ where: { tenantId: this.context.currentTenantId(), discussionId, threadId: threadId ?? undefined, deletedAt: null }, include: { mentions: { where: { deletedAt: null } }, reactions: { where: { deletedAt: null } } }, orderBy: { createdAt: 'asc' }, take: 200 });
  }

  async createMention(messageId: string, dto: CreateMentionDto) {
    const message = await this.requireMessage(messageId);
    return this.prisma.collaborationMention.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: message.workspaceId ?? this.context.currentWorkspaceId(), messageId, targetUserId: dto.targetUserId, targetTeamId: dto.targetTeamId, mentionType: dto.mentionType ?? 'user', metadata: dto.metadata ?? {} } });
  }

  async createReaction(messageId: string, dto: CreateReactionDto) {
    const message = await this.requireMessage(messageId);
    return this.prisma.collaborationReaction.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: message.workspaceId ?? this.context.currentWorkspaceId(), messageId, actorUserId: dto.actorUserId ?? this.context.context()?.userId, reactionType: dto.reactionType, metadata: dto.metadata ?? {} } });
  }

  searchDiscussions(query: string) {
    const value = query.trim();
    return this.prisma.discussion.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null, OR: value ? [{ title: { contains: value, mode: 'insensitive' } }, { topicType: { contains: value, mode: 'insensitive' } }] : undefined }, include: { space: true, messages: { where: value ? { body: { contains: value, mode: 'insensitive' }, deletedAt: null } : { deletedAt: null }, take: 5 } }, orderBy: { lastActivityAt: 'desc' }, take: 50 });
  }

  private async requireDiscussion(id: string) {
    const discussion = await this.prisma.discussion.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!discussion) throw new NotFoundException('Discussion not found');
    return discussion;
  }

  private async requireThread(id: string) {
    const thread = await this.prisma.discussionThread.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!thread) throw new NotFoundException('Discussion thread not found');
    return thread;
  }

  private async requireMessage(id: string) {
    const message = await this.prisma.discussionMessage.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!message) throw new NotFoundException('Discussion message not found');
    return message;
  }
}