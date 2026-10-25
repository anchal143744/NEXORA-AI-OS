import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CommunicationsIndexService } from './communications-index.service';
import { AddMeetingParticipantDto, CreateMeetingActionDto, CreateMeetingAgendaDto, CreateMeetingDecisionDto, CreateMeetingDto, GenerateMeetingSummaryDto } from './dto/communications.dto';

type MeetingAction = { title: string; description?: string; priority?: string; assigneeUserId?: string; dueAt?: string };

@Injectable()
export class MeetingsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly indexer: CommunicationsIndexService) {}

  meetings(status?: string) {
    return this.prisma.meeting.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, deletedAt: null }, include: { participants: { where: { deletedAt: null }, take: 8 }, agendas: { where: { deletedAt: null }, orderBy: { orderIndex: 'asc' }, take: 5 }, summaries: { where: { deletedAt: null }, take: 1 } }, orderBy: { startsAt: 'asc' }, take: 100 });
  }

  async createMeeting(dto: CreateMeetingDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const meeting = await this.prisma.meeting.create({ data: { tenantId, workspaceId, meetingKey: dto.meetingKey ?? `meeting-${randomUUID()}`, title: dto.title, description: dto.description, meetingType: dto.meetingType ?? 'standard', privacy: dto.privacy ?? 'workspace', organizerUserId: dto.organizerUserId ?? this.context.context()?.userId, channelId: dto.channelId, conversationId: dto.conversationId, timezone: dto.timezone ?? 'UTC', startsAt: new Date(dto.startsAt), endsAt: new Date(dto.endsAt), location: dto.location, meetingUrl: dto.meetingUrl, recurrenceRule: dto.recurrenceRule, context: dto.context ?? {}, metadata: dto.metadata ?? {} } });
    for (const participant of dto.participants ?? []) {
      await this.prisma.meetingParticipant.create({ data: { tenantId, workspaceId, meetingId: meeting.id, userId: participant.userId, email: participant.email, participantRole: participant.participantRole ?? 'attendee', required: participant.required ?? true } });
    }
    await this.indexer.indexRecord({ sourceType: 'meeting', sourceId: meeting.id, moduleKey: 'meetings', title: meeting.title, summary: meeting.description ?? undefined, searchableText: [meeting.title, meeting.description, meeting.meetingType, meeting.location].filter(Boolean).join(' '), workspaceId, metadata: { meetingKey: meeting.meetingKey, startsAt: meeting.startsAt, status: meeting.status } });
    await this.events.publish({ tenantId, workspaceId, type: 'meeting.created', source: 'meeting-center', subject: { type: 'meeting', id: meeting.id }, payload: { title: meeting.title, startsAt: meeting.startsAt, endsAt: meeting.endsAt, participantCount: dto.participants?.length ?? 0 }, actorUserId: this.context.context()?.userId });
    return meeting;
  }

  async getMeeting(id: string) {
    const meeting = await this.prisma.meeting.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { participants: { where: { deletedAt: null } }, agendas: { where: { deletedAt: null }, orderBy: { orderIndex: 'asc' } }, decisions: { where: { deletedAt: null } }, actionItems: { where: { deletedAt: null } }, summaries: { where: { deletedAt: null }, orderBy: { generatedAt: 'desc' } }, calendarEvents: { where: { deletedAt: null } }, recommendations: { where: { deletedAt: null } } } });
    if (!meeting) throw new NotFoundException('Meeting not found');
    return meeting;
  }

  async addParticipant(meetingId: string, dto: AddMeetingParticipantDto) {
    const meeting = await this.requireMeeting(meetingId);
    return this.prisma.meetingParticipant.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? meeting.workspaceId ?? this.context.currentWorkspaceId(), meetingId, userId: dto.userId, email: dto.email, participantRole: dto.participantRole ?? 'attendee', required: dto.required ?? true, responseStatus: dto.responseStatus ?? 'pending', metadata: dto.metadata ?? {} } });
  }

  async addAgenda(meetingId: string, dto: CreateMeetingAgendaDto) {
    const meeting = await this.requireMeeting(meetingId);
    return this.prisma.meetingAgenda.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? meeting.workspaceId ?? this.context.currentWorkspaceId(), meetingId, agendaKey: dto.agendaKey ?? `agenda-${randomUUID()}`, title: dto.title, description: dto.description, orderIndex: dto.orderIndex ?? 0, durationMinutes: dto.durationMinutes, presenterUserId: dto.presenterUserId, metadata: dto.metadata ?? {} } });
  }

  async addDecision(meetingId: string, dto: CreateMeetingDecisionDto) {
    const meeting = await this.requireMeeting(meetingId);
    const decision = await this.prisma.meetingDecision.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? meeting.workspaceId ?? this.context.currentWorkspaceId(), meetingId, decisionKey: dto.decisionKey ?? `meeting-decision-${randomUUID()}`, title: dto.title, outcome: dto.outcome, rationale: dto.rationale, decidedByUserId: dto.decidedByUserId ?? this.context.context()?.userId, impact: dto.impact ?? {}, metadata: dto.metadata ?? {} } });
    await this.indexer.indexRecord({ sourceType: 'meeting_decision', sourceId: decision.id, moduleKey: 'meetings', title: decision.title, summary: decision.rationale ?? decision.outcome, searchableText: [decision.title, decision.outcome, decision.rationale].filter(Boolean).join(' '), workspaceId: decision.workspaceId, metadata: { meetingId, outcome: decision.outcome } });
    return decision;
  }

  async addAction(meetingId: string, dto: CreateMeetingActionDto) {
    const meeting = await this.requireMeeting(meetingId);
    return this.prisma.meetingActionItem.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? meeting.workspaceId ?? this.context.currentWorkspaceId(), meetingId, summaryId: dto.summaryId, actionKey: dto.actionKey ?? `meeting-action-${randomUUID()}`, title: dto.title, description: dto.description, priority: dto.priority ?? 'medium', assigneeUserId: dto.assigneeUserId, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, sourceType: dto.sourceType, sourceId: dto.sourceId, metadata: dto.metadata ?? {} } });
  }

  async history(meetingId: string) {
    await this.requireMeeting(meetingId);
    return { decisions: await this.prisma.meetingDecision.findMany({ where: { tenantId: this.context.currentTenantId(), meetingId, deletedAt: null }, orderBy: { decidedAt: 'desc' } }), actionItems: await this.prisma.meetingActionItem.findMany({ where: { tenantId: this.context.currentTenantId(), meetingId, deletedAt: null }, orderBy: { createdAt: 'desc' } }), summaries: await this.prisma.meetingSummary.findMany({ where: { tenantId: this.context.currentTenantId(), meetingId, deletedAt: null }, orderBy: { generatedAt: 'desc' } }) };
  }

  templates() {
    return [{ key: 'executive-review', name: 'Executive Review', agenda: ['Business health', 'Risks', 'Decisions', 'Follow-ups'] }, { key: 'department-sync', name: 'Department Sync', agenda: ['Metrics', 'Blockers', 'Dependencies', 'Actions'] }, { key: 'customer-review', name: 'Customer Review', agenda: ['Account status', 'Open issues', 'Expansion', 'Next steps'] }];
  }

  summaries(summaryType?: string) {
    return this.prisma.meetingSummary.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, summaryType: summaryType ?? undefined, deletedAt: null }, include: { meeting: true, actionRecords: { where: { deletedAt: null } } }, orderBy: { generatedAt: 'desc' }, take: 100 });
  }

  async generateSummary(meetingId: string, dto: GenerateMeetingSummaryDto) {
    const meeting = await this.getMeeting(meetingId);
    const sourceText = dto.sourceText?.trim() || [meeting.title, meeting.description, JSON.stringify(meeting.agendas), JSON.stringify(meeting.decisions), JSON.stringify(meeting.actionItems)].filter(Boolean).join('\n');
    const actions = dto.actionItems?.length ? dto.actionItems as MeetingAction[] : this.extractActions(sourceText);
    const decisions = dto.decisions?.length ? dto.decisions : this.extractDecisions(sourceText);
    const summaryText = this.summarize(sourceText);
    const summary = await this.prisma.meetingSummary.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? meeting.workspaceId ?? this.context.currentWorkspaceId(), meetingId, summaryKey: dto.summaryKey ?? `meeting-summary-${randomUUID()}`, summaryType: dto.summaryType ?? 'meeting', title: dto.title, summary: summaryText, decisions, actionItems: actions, risks: dto.risks ?? this.extractRisks(sourceText), followUps: dto.followUps ?? [], sourceRefs: dto.sourceRefs ?? [{ sourceType: 'meeting', sourceId: meetingId }], provider: dto.provider ?? 'nexora-ai-provider-abstraction', model: dto.model ?? 'meeting-intelligence-v1', generatedByUserId: dto.generatedByUserId ?? this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    if (dto.createActionItems !== false) {
      for (const action of actions.slice(0, 25)) await this.addAction(meetingId, { workspaceId: summary.workspaceId ?? undefined, summaryId: summary.id, title: action.title, description: action.description, priority: action.priority ?? 'medium', assigneeUserId: action.assigneeUserId, dueAt: action.dueAt, sourceType: 'meeting_summary', sourceId: summary.id, metadata: { extracted: true } });
    }
    await this.indexer.indexRecord({ sourceType: 'meeting_summary', sourceId: summary.id, moduleKey: 'meeting_intelligence', title: summary.title, summary: summary.summary, searchableText: `${summary.title}\n${summary.summary}`, workspaceId: summary.workspaceId, metadata: { meetingId, summaryType: summary.summaryType } });
    await this.events.publish({ tenantId: this.context.currentTenantId(), workspaceId: summary.workspaceId ?? undefined, type: 'meeting.summary.generated', source: 'meeting-intelligence', subject: { type: 'meeting_summary', id: summary.id }, payload: { meetingId, actionItemCount: actions.length, decisionCount: decisions.length }, actorUserId: this.context.context()?.userId });
    return { summary, actions, decisions };
  }

  async extractIntelligence(meetingId: string, dto: GenerateMeetingSummaryDto) {
    await this.requireMeeting(meetingId);
    const text = dto.sourceText ?? dto.title;
    return { decisions: this.extractDecisions(text), actionItems: this.extractActions(text), risks: this.extractRisks(text), priority: /urgent|critical|executive|blocked/i.test(text) ? 'high' : 'normal' };
  }

  private async requireMeeting(id: string) {
    const meeting = await this.prisma.meeting.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!meeting) throw new NotFoundException('Meeting not found');
    return meeting;
  }

  private summarize(text: string) { const cleaned = text.replace(/\s+/g, ' ').trim(); return cleaned.length > 800 ? `${cleaned.slice(0, 800)}...` : cleaned || 'No meeting source text provided.'; }
  private extractActions(text: string): MeetingAction[] { return text.split(/\r?\n|\. /).map((line) => line.trim()).filter((line) => /action|todo|follow up|assign|owner|next step|deadline|review/i.test(line)).slice(0, 10).map((line, index) => ({ title: line.slice(0, 90) || `Action ${index + 1}`, description: line, priority: /urgent|critical|blocked/i.test(line) ? 'high' : 'medium' })); }
  private extractDecisions(text: string) { return text.split(/\r?\n|\. /).map((line) => line.trim()).filter((line) => /decided|decision|approved|rejected|agreed/i.test(line)).slice(0, 10).map((line) => ({ title: line.slice(0, 90), evidence: line })); }
  private extractRisks(text: string) { return text.split(/\r?\n|\. /).map((line) => line.trim()).filter((line) => /risk|blocked|delay|issue|failure|conflict/i.test(line)).slice(0, 10).map((line) => ({ title: line.slice(0, 90), evidence: line, severity: /critical|urgent|blocked/i.test(line) ? 'high' : 'medium' })); }
}