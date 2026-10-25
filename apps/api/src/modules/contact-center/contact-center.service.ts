import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateAgentAssignmentDto, CreateContactCenterQueueDto, CreateEscalationDto, UpdateAssignmentStatusDto } from './dto/contact-center.dto';

@Injectable()
export class ContactCenterService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  queues(status?: string) {
    return this.prisma.contactCenterQueue.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: [{ priority: 'asc' }, { updatedAt: 'desc' }], take: 100 });
  }

  async createQueue(dto: CreateContactCenterQueueDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const queue = await this.prisma.contactCenterQueue.create({ data: { tenantId, workspaceId, queueKey: dto.queueKey ?? `queue-${randomUUID()}`, name: dto.name, description: dto.description, queueType: dto.queueType ?? 'support', priority: dto.priority ?? 'normal', departmentId: dto.departmentId, teamId: dto.teamId, channelTypes: dto.channelTypes ?? ['email', 'whatsapp', 'sms', 'live_chat', 'voice', 'internal'], routingStrategy: dto.routingStrategy ?? 'least_loaded', slaTargetSeconds: dto.slaTargetSeconds ?? 3600, maxWaitSeconds: dto.maxWaitSeconds, businessHours: dto.businessHours ?? {}, escalationPolicy: dto.escalationPolicy ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'contact_center.queue.created', source: 'contact-center', subject: { type: 'contact_center_queue', id: queue.id }, payload: { name: queue.name, queueType: queue.queueType, routingStrategy: queue.routingStrategy }, actorUserId: this.context.context()?.userId });
    return queue;
  }

  async getQueue(id: string) {
    const queue = await this.prisma.contactCenterQueue.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!queue) throw new NotFoundException('Contact center queue not found');
    const assignments = await this.prisma.agentAssignment.findMany({ where: { tenantId: this.context.currentTenantId(), queueId: id, deletedAt: null }, orderBy: { assignedAt: 'desc' }, take: 50 });
    return { ...queue, assignments };
  }

  assignments(status?: string, queueId?: string) {
    return this.prisma.agentAssignment.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, queueId: queueId ?? undefined, deletedAt: null }, orderBy: { assignedAt: 'desc' }, take: 150 });
  }

  async createAssignment(dto: CreateAgentAssignmentDto) {
    if (dto.queueId) await this.requireQueue(dto.queueId);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const assignment = await this.prisma.agentAssignment.create({ data: { tenantId, workspaceId, assignmentKey: dto.assignmentKey ?? `assignment-${randomUUID()}`, queueId: dto.queueId, conversationId: dto.conversationId, voiceSessionId: dto.voiceSessionId, customerIdentityId: dto.customerIdentityId, assignedUserId: dto.assignedUserId ?? this.context.context()?.userId, assignmentType: dto.assignmentType ?? 'conversation', priority: dto.priority ?? 'normal', slaDueAt: dto.slaDueAt ? new Date(dto.slaDueAt) : undefined, routingReason: dto.routingReason ?? 'policy_routing', metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'contact_center.assignment.created', source: 'contact-center-routing', subject: { type: 'agent_assignment', id: assignment.id }, payload: { queueId: assignment.queueId, assignmentType: assignment.assignmentType, priority: assignment.priority, assignedUserId: assignment.assignedUserId }, actorUserId: this.context.context()?.userId });
    return assignment;
  }

  async updateAssignmentStatus(id: string, dto: UpdateAssignmentStatusDto) {
    await this.requireAssignment(id);
    const data: Record<string, unknown> = { status: dto.status, metadata: dto.metadata ?? {} };
    if (dto.status === 'accepted') data.acceptedAt = new Date();
    if (['resolved', 'closed'].includes(dto.status)) data.resolvedAt = new Date();
    return this.prisma.agentAssignment.update({ where: { id }, data });
  }

  async escalate(dto: CreateEscalationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const escalation = await this.prisma.escalationEvent.create({ data: { tenantId, workspaceId, escalationKey: dto.escalationKey ?? `escalation-${randomUUID()}`, queueId: dto.queueId, conversationId: dto.conversationId, voiceSessionId: dto.voiceSessionId, customerIdentityId: dto.customerIdentityId, assignmentId: dto.assignmentId, escalationType: dto.escalationType ?? 'support', severity: dto.severity ?? 'medium', reason: dto.reason, recommendation: dto.recommendation, fromUserId: dto.fromUserId ?? this.context.context()?.userId, toUserId: dto.toUserId, metadata: dto.metadata ?? {} } });
    if (dto.assignmentId) await this.prisma.agentAssignment.update({ where: { id: dto.assignmentId }, data: { escalationLevel: { increment: 1 }, priority: dto.severity === 'critical' ? 'critical' : 'high' } });
    await this.events.publish({ tenantId, workspaceId, type: 'contact_center.escalated', source: 'contact-center-escalation', subject: { type: 'escalation_event', id: escalation.id }, payload: { severity: escalation.severity, escalationType: escalation.escalationType, queueId: escalation.queueId, assignmentId: escalation.assignmentId }, actorUserId: this.context.context()?.userId });
    return escalation;
  }

  escalations(status?: string) {
    return this.prisma.escalationEvent.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { escalatedAt: 'desc' }, take: 100 });
  }

  async unifiedInbox(queueId?: string) {
    const [assignments, voiceSessions, conversations] = await Promise.all([
      this.assignments('assigned', queueId),
      this.prisma.voiceSession.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, queueId: queueId ?? undefined, status: { in: ['active', 'waiting'] }, deletedAt: null }, orderBy: { startedAt: 'desc' }, take: 50 }),
      this.prisma.conversation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: 'active', deletedAt: null }, orderBy: { lastMessageAt: 'desc' }, take: 50 }),
    ]);
    return { assignments, voiceSessions, conversations };
  }

  async serviceLevels(queueId?: string) {
    const queues = queueId ? [await this.requireQueue(queueId)] : await this.queues('active');
    const openAssignments = await this.prisma.agentAssignment.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, queueId: queueId ?? undefined, status: { in: ['assigned', 'accepted', 'waiting'] }, deletedAt: null }, take: 500 });
    const now = Date.now();
    const breached = openAssignments.filter((assignment: { slaDueAt?: Date | null }) => assignment.slaDueAt && assignment.slaDueAt.getTime() < now).length;
    return { queueCount: queues.length, openAssignments: openAssignments.length, breachedAssignments: breached, serviceLevel: openAssignments.length ? Math.max(0, 1 - breached / openAssignments.length) : 1 };
  }

  agentWorkspace(userId?: string) {
    const assignedUserId = userId ?? this.context.context()?.userId;
    return this.prisma.agentAssignment.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, assignedUserId: assignedUserId ?? undefined, status: { in: ['assigned', 'accepted', 'waiting'] }, deletedAt: null }, orderBy: [{ priority: 'asc' }, { assignedAt: 'desc' }], take: 100 });
  }

  private async requireQueue(id: string) {
    const queue = await this.prisma.contactCenterQueue.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!queue) throw new NotFoundException('Contact center queue not found');
    return queue;
  }

  private async requireAssignment(id: string) {
    const assignment = await this.prisma.agentAssignment.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!assignment) throw new NotFoundException('Agent assignment not found');
    return assignment;
  }
}
