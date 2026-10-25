import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CollaborationFeedService } from '../collaboration-feed.service';
import { CollaborationIndexService } from '../collaboration-index.service';
import { AddDecisionParticipantDto, CastDecisionVoteDto, CreateDecisionApprovalDto, CreateDecisionRecordDto, CreateDecisionRoomDto, DecideDecisionApprovalDto } from '../dto/collaboration.dto';

@Injectable()
export class DecisionRoomsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly feed: CollaborationFeedService, private readonly indexer: CollaborationIndexService) {}

  rooms(status?: string, spaceId?: string) {
    return this.prisma.decisionRoom.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, spaceId: spaceId ?? undefined, deletedAt: null }, include: { space: true, _count: { select: { participants: true, votes: true, approvals: true, records: true } } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createRoom(dto: CreateDecisionRoomDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const room = await this.prisma.decisionRoom.create({ data: { tenantId, workspaceId, spaceId: dto.spaceId, roomKey: dto.roomKey ?? `decision-${randomUUID()}`, title: dto.title, description: dto.description, decisionType: dto.decisionType ?? 'operational', priority: dto.priority ?? 'medium', createdByUserId: dto.createdByUserId ?? this.context.context()?.userId, facilitatorUserId: dto.facilitatorUserId, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, startedAt: new Date(), criteria: dto.criteria ?? {}, context: dto.context ?? {}, metadata: dto.metadata ?? {} } });
    await this.indexer.indexRecord({ sourceType: 'decision_room', sourceId: room.id, moduleKey: 'decision_rooms', title: room.title, summary: room.description ?? undefined, searchableText: [room.title, room.description, room.decisionType].filter(Boolean).join(' '), workspaceId: room.workspaceId, metadata: { roomKey: room.roomKey, status: room.status, decisionType: room.decisionType } });
    await this.events.publish({ tenantId, workspaceId, type: 'decision.room.created', source: 'decision-room-engine', subject: { type: 'decision_room', id: room.id }, payload: { title: room.title, decisionType: room.decisionType, priority: room.priority }, actorUserId: this.context.context()?.userId });
    await this.feed.recordActivity({ workspaceId, spaceId: room.spaceId, actorUserId: this.context.context()?.userId, activityType: 'decision_room.created', subjectType: 'decision_room', subjectId: room.id, description: room.title, payload: { decisionType: room.decisionType, priority: room.priority } });
    return room;
  }

  async getRoom(id: string) {
    const room = await this.prisma.decisionRoom.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { space: true, participants: { where: { deletedAt: null } }, votes: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } }, approvals: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } }, records: { where: { deletedAt: null }, orderBy: { decidedAt: 'desc' } }, summaries: { where: { deletedAt: null }, orderBy: { generatedAt: 'desc' } } } });
    if (!room) throw new NotFoundException('Decision room not found');
    return room;
  }

  async addParticipant(roomId: string, dto: AddDecisionParticipantDto) {
    const room = await this.requireRoom(roomId);
    return this.prisma.decisionParticipant.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? room.workspaceId ?? this.context.currentWorkspaceId(), roomId, participantUserId: dto.participantUserId, participantRole: dto.participantRole ?? 'member', status: dto.status ?? 'invited', joinedAt: dto.status === 'joined' ? new Date() : undefined, metadata: dto.metadata ?? {} } });
  }

  async castVote(roomId: string, dto: CastDecisionVoteDto) {
    const room = await this.requireRoom(roomId);
    const vote = await this.prisma.decisionVote.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? room.workspaceId ?? this.context.currentWorkspaceId(), roomId, participantId: dto.participantId, voterUserId: dto.voterUserId ?? this.context.context()?.userId, voteValue: dto.voteValue, voteWeight: dto.voteWeight ?? 1, rationale: dto.rationale, confidence: dto.confidence, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId: this.context.currentTenantId(), workspaceId: vote.workspaceId ?? undefined, type: 'decision.vote.cast', source: 'decision-room-engine', subject: { type: 'decision_vote', id: vote.id }, payload: { roomId, voteValue: vote.voteValue, voteWeight: vote.voteWeight, confidence: vote.confidence }, actorUserId: this.context.context()?.userId });
    return vote;
  }

  async createApproval(roomId: string, dto: CreateDecisionApprovalDto) {
    const room = await this.requireRoom(roomId);
    return this.prisma.decisionApproval.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? room.workspaceId ?? this.context.currentWorkspaceId(), roomId, approverUserId: dto.approverUserId, approvalLevel: dto.approvalLevel ?? 'manager', dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, metadata: dto.metadata ?? {} } });
  }

  async decideApproval(roomId: string, approvalId: string, dto: DecideDecisionApprovalDto) {
    await this.requireRoom(roomId);
    const approval = await this.prisma.decisionApproval.findFirst({ where: { tenantId: this.context.currentTenantId(), id: approvalId, roomId, deletedAt: null } });
    if (!approval) throw new NotFoundException('Decision approval not found');
    const decided = await this.prisma.decisionApproval.update({ where: { id: approvalId }, data: { status: dto.status, decision: dto.decision, comments: dto.comments, decidedAt: new Date() } });
    await this.events.publish({ tenantId: this.context.currentTenantId(), workspaceId: decided.workspaceId ?? undefined, type: 'decision.approval.decided', source: 'decision-room-engine', subject: { type: 'decision_approval', id: decided.id }, payload: { roomId, status: decided.status, approvalLevel: decided.approvalLevel }, actorUserId: this.context.context()?.userId });
    return decided;
  }

  async createRecord(roomId: string, dto: CreateDecisionRecordDto) {
    const room = await this.requireRoom(roomId);
    const record = await this.prisma.decisionRecord.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? room.workspaceId ?? this.context.currentWorkspaceId(), roomId, recordKey: dto.recordKey ?? `decision-record-${randomUUID()}`, decisionTitle: dto.decisionTitle, outcome: dto.outcome, rationale: dto.rationale, selectedOption: dto.selectedOption, impact: dto.impact ?? {}, decisionByUserId: dto.decisionByUserId ?? this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    await this.prisma.decisionRoom.update({ where: { id: roomId }, data: { status: 'decided', closedAt: new Date() } });
    await this.indexer.indexRecord({ sourceType: 'decision_record', sourceId: record.id, moduleKey: 'decision_rooms', title: record.decisionTitle, summary: record.rationale ?? record.outcome, searchableText: [record.decisionTitle, record.outcome, record.rationale, record.selectedOption].filter(Boolean).join(' '), workspaceId: record.workspaceId, metadata: { roomId, outcome: record.outcome, selectedOption: record.selectedOption } });
    await this.events.publish({ tenantId: this.context.currentTenantId(), workspaceId: record.workspaceId ?? undefined, type: 'decision.record.created', source: 'decision-room-engine', subject: { type: 'decision_record', id: record.id }, payload: { roomId, outcome: record.outcome, selectedOption: record.selectedOption }, actorUserId: this.context.context()?.userId });
    await this.feed.recordActivity({ workspaceId: record.workspaceId, spaceId: room.spaceId, actorUserId: this.context.context()?.userId, activityType: 'decision_record.created', subjectType: 'decision_record', subjectId: record.id, description: record.decisionTitle, payload: { outcome: record.outcome } });
    return record;
  }

  async history(roomId: string) {
    await this.requireRoom(roomId);
    return { records: await this.prisma.decisionRecord.findMany({ where: { tenantId: this.context.currentTenantId(), roomId, deletedAt: null }, orderBy: { decidedAt: 'desc' } }), votes: await this.prisma.decisionVote.findMany({ where: { tenantId: this.context.currentTenantId(), roomId, deletedAt: null }, orderBy: { createdAt: 'desc' } }), approvals: await this.prisma.decisionApproval.findMany({ where: { tenantId: this.context.currentTenantId(), roomId, deletedAt: null }, orderBy: { createdAt: 'desc' } }) };
  }

  searchDecisions(query: string) {
    const value = query.trim();
    return this.prisma.decisionRoom.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null, OR: value ? [{ title: { contains: value, mode: 'insensitive' } }, { description: { contains: value, mode: 'insensitive' } }, { decisionType: { contains: value, mode: 'insensitive' } }] : undefined }, include: { records: { where: { deletedAt: null }, orderBy: { decidedAt: 'desc' }, take: 3 }, votes: { where: { deletedAt: null }, take: 5 } }, orderBy: { updatedAt: 'desc' }, take: 50 });
  }

  private async requireRoom(id: string) {
    const room = await this.prisma.decisionRoom.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!room) throw new NotFoundException('Decision room not found');
    return room;
  }
}