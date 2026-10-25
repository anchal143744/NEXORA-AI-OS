import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateActionItemDto, CreateCollaborationActivityDto } from './dto/collaboration.dto';

@Injectable()
export class CollaborationFeedService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  activity(spaceId?: string) {
    return this.prisma.collaborationActivity.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, spaceId: spaceId ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 150 });
  }

  createActivity(dto: CreateCollaborationActivityDto) {
    return this.recordActivity({ workspaceId: dto.workspaceId, spaceId: dto.spaceId, actorUserId: dto.actorUserId, activityType: dto.activityType, subjectType: dto.subjectType, subjectId: dto.subjectId, description: dto.description, payload: dto.payload });
  }

  mentions(status?: string) {
    return this.prisma.collaborationMention.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, targetUserId: this.context.context()?.userId ?? undefined, status: status ?? undefined, deletedAt: null }, include: { message: true }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  actionItems(status?: string) {
    return this.prisma.collaborationActionItem.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, deletedAt: null }, include: { space: true, discussion: true, room: true, summary: true }, orderBy: { createdAt: 'desc' }, take: 150 });
  }

  async createActionItem(dto: CreateActionItemDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const action = await this.prisma.collaborationActionItem.create({ data: { tenantId, workspaceId, spaceId: dto.spaceId, discussionId: dto.discussionId, roomId: dto.roomId, summaryId: dto.summaryId, actionKey: dto.actionKey ?? `action-${randomUUID()}`, title: dto.title, description: dto.description, priority: dto.priority ?? 'medium', assigneeUserId: dto.assigneeUserId, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, sourceType: dto.sourceType, sourceId: dto.sourceId, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'collaboration.action_item.created', source: 'collaboration-engine', subject: { type: 'collaboration_action_item', id: action.id }, payload: { title: action.title, priority: action.priority, assigneeUserId: action.assigneeUserId }, actorUserId: this.context.context()?.userId });
    await this.recordActivity({ workspaceId, spaceId: action.spaceId, actorUserId: this.context.context()?.userId, activityType: 'action_item.created', subjectType: 'collaboration_action_item', subjectId: action.id, description: action.title, payload: { priority: action.priority } });
    return action;
  }

  async completeActionItem(id: string) {
    const action = await this.prisma.collaborationActionItem.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!action) throw new NotFoundException('Collaboration action item not found');
    const completed = await this.prisma.collaborationActionItem.update({ where: { id }, data: { status: 'completed', completedAt: new Date() } });
    await this.recordActivity({ workspaceId: completed.workspaceId, spaceId: completed.spaceId, actorUserId: this.context.context()?.userId, activityType: 'action_item.completed', subjectType: 'collaboration_action_item', subjectId: completed.id, description: completed.title, payload: { completedAt: completed.completedAt } });
    return completed;
  }

  async recordActivity(input: { workspaceId?: string | null; spaceId?: string | null; actorUserId?: string | null; activityType: string; subjectType: string; subjectId: string; description?: string | null; payload?: Record<string, unknown> | null }) {
    return this.prisma.collaborationActivity.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: input.workspaceId ?? this.context.currentWorkspaceId(), spaceId: input.spaceId, actorUserId: input.actorUserId ?? this.context.context()?.userId, activityType: input.activityType, subjectType: input.subjectType, subjectId: input.subjectId, description: input.description, payload: input.payload ?? {} } });
  }
}