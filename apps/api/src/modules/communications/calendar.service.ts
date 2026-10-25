import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CommunicationsIndexService } from './communications-index.service';
import { CreateAvailabilityWindowDto, CreateCalendarDto, CreateCalendarEventDto, CreateReminderDto, CreateScheduleRuleDto, SchedulingRequestDto, UpsertNotificationPreferenceDto } from './dto/communications.dto';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly eventBus: EventBusService, private readonly indexer: CommunicationsIndexService) {}

  calendars(calendarType?: string) {
    return this.prisma.calendar.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, calendarType: calendarType ?? undefined, deletedAt: null }, include: { _count: { select: { events: true, scheduleRules: true, availabilityWindows: true } } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  createCalendar(dto: CreateCalendarDto) {
    return this.prisma.calendar.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), calendarKey: dto.calendarKey ?? `calendar-${randomUUID()}`, name: dto.name, description: dto.description, calendarType: dto.calendarType, ownerUserId: dto.ownerUserId ?? this.context.context()?.userId, departmentId: dto.departmentId, teamId: dto.teamId, timezone: dto.timezone ?? 'UTC', visibility: dto.visibility ?? 'private', color: dto.color, metadata: dto.metadata ?? {} } });
  }

  async getCalendar(id: string) {
    const calendar = await this.prisma.calendar.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { events: { where: { deletedAt: null }, orderBy: { startsAt: 'asc' }, take: 50 }, scheduleRules: { where: { deletedAt: null } }, availabilityWindows: { where: { deletedAt: null }, orderBy: { startsAt: 'asc' }, take: 50 } } });
    if (!calendar) throw new NotFoundException('Calendar not found');
    return calendar;
  }

  events(calendarId?: string, status?: string) {
    return this.prisma.calendarEvent.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, calendarId: calendarId ?? undefined, status: status ?? undefined, deletedAt: null }, include: { calendar: true, participants: { where: { deletedAt: null }, take: 8 }, reminders: { where: { deletedAt: null }, take: 5 } }, orderBy: { startsAt: 'asc' }, take: 150 });
  }

  async createEvent(dto: CreateCalendarEventDto) {
    const calendar = await this.requireCalendar(dto.calendarId);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? calendar.workspaceId ?? this.context.currentWorkspaceId();
    const event = await this.prisma.calendarEvent.create({ data: { tenantId, workspaceId, calendarId: dto.calendarId, meetingId: dto.meetingId, eventKey: dto.eventKey ?? `event-${randomUUID()}`, title: dto.title, description: dto.description, eventType: dto.eventType ?? 'meeting', privacy: dto.privacy ?? 'private', timezone: dto.timezone ?? calendar.timezone ?? 'UTC', startsAt: new Date(dto.startsAt), endsAt: new Date(dto.endsAt), allDay: dto.allDay ?? false, recurrenceRule: dto.recurrenceRule, location: dto.location, meetingUrl: dto.meetingUrl, organizerUserId: dto.organizerUserId ?? this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    for (const participant of dto.participants ?? []) {
      await this.prisma.calendarParticipant.create({ data: { tenantId, workspaceId, eventId: event.id, userId: participant.userId, email: participant.email, required: participant.required ?? true } });
    }
    await this.indexer.indexRecord({ sourceType: 'calendar_event', sourceId: event.id, moduleKey: 'calendar', title: event.title, summary: event.description ?? undefined, searchableText: [event.title, event.description, event.location, event.eventType].filter(Boolean).join(' '), workspaceId, metadata: { startsAt: event.startsAt, endsAt: event.endsAt, calendarId: event.calendarId } });
    await this.eventBus.publish({ tenantId, workspaceId, type: 'calendar.event.created', source: 'calendar-intelligence', subject: { type: 'calendar_event', id: event.id }, payload: { title: event.title, startsAt: event.startsAt, endsAt: event.endsAt, calendarId: event.calendarId }, actorUserId: this.context.context()?.userId });
    return event;
  }

  async getEvent(id: string) {
    const event = await this.prisma.calendarEvent.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { calendar: true, participants: { where: { deletedAt: null } }, reminders: { where: { deletedAt: null } }, meeting: true } });
    if (!event) throw new NotFoundException('Calendar event not found');
    return event;
  }

  async addEventParticipant(eventId: string, participant: { userId?: string; email?: string; participantRole?: string; required?: boolean }) {
    const event = await this.requireEvent(eventId);
    return this.prisma.calendarParticipant.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: event.workspaceId ?? this.context.currentWorkspaceId(), eventId, userId: participant.userId, email: participant.email, participantRole: participant.participantRole ?? 'attendee', required: participant.required ?? true } });
  }

  scheduleRules(calendarId?: string) {
    return this.prisma.scheduleRule.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, calendarId: calendarId ?? undefined, deletedAt: null }, orderBy: { priority: 'asc' }, take: 100 });
  }

  async createScheduleRule(dto: CreateScheduleRuleDto) {
    if (dto.calendarId) await this.requireCalendar(dto.calendarId);
    return this.prisma.scheduleRule.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), calendarId: dto.calendarId, ruleKey: dto.ruleKey ?? `schedule-rule-${randomUUID()}`, name: dto.name, ruleType: dto.ruleType, timezone: dto.timezone ?? 'UTC', priority: dto.priority ?? 100, workingDays: dto.workingDays ?? [], constraints: dto.constraints ?? {}, enabled: dto.enabled ?? true, metadata: dto.metadata ?? {} } });
  }

  availability(userId?: string, calendarId?: string) {
    return this.prisma.availabilityWindow.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, userId: userId ?? undefined, calendarId: calendarId ?? undefined, deletedAt: null }, orderBy: { startsAt: 'asc' }, take: 150 });
  }

  async createAvailability(dto: CreateAvailabilityWindowDto) {
    if (dto.calendarId) await this.requireCalendar(dto.calendarId);
    const window = await this.prisma.availabilityWindow.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), calendarId: dto.calendarId, userId: dto.userId, teamId: dto.teamId, departmentId: dto.departmentId, windowKey: dto.windowKey ?? `availability-${randomUUID()}`, timezone: dto.timezone ?? 'UTC', startsAt: new Date(dto.startsAt), endsAt: new Date(dto.endsAt), availabilityType: dto.availabilityType ?? 'available', source: dto.source ?? 'manual', metadata: dto.metadata ?? {} } });
    await this.eventBus.publish({ tenantId: this.context.currentTenantId(), workspaceId: window.workspaceId ?? undefined, type: 'availability.updated', source: 'calendar-intelligence', subject: { type: 'availability_window', id: window.id }, payload: { userId: window.userId, calendarId: window.calendarId, startsAt: window.startsAt, endsAt: window.endsAt, availabilityType: window.availabilityType }, actorUserId: this.context.context()?.userId });
    return window;
  }

  async analyzeAvailability(dto: SchedulingRequestDto) {
    const start = dto.preferredStartAt ? new Date(dto.preferredStartAt) : new Date();
    const end = dto.preferredEndAt ? new Date(dto.preferredEndAt) : new Date(start.getTime() + (dto.durationMinutes ?? 30) * 60000);
    const [events, availability] = await Promise.all([this.events(dto.calendarId), this.availability(undefined, dto.calendarId)]);
    const conflicts = events.filter((event: { startsAt: Date; endsAt: Date }) => event.startsAt < end && event.endsAt > start);
    const matchingAvailability = availability.filter((window: { startsAt: Date; endsAt: Date; availabilityType: string }) => window.startsAt <= start && window.endsAt >= end && window.availabilityType === 'available');
    return { requestedWindow: { startsAt: start, endsAt: end, timezone: dto.timezone ?? 'UTC' }, conflictCount: conflicts.length, availabilityMatches: matchingAvailability.length, conflicts, matchingAvailability };
  }

  async recommendMeeting(dto: SchedulingRequestDto) {
    const analysis = await this.analyzeAvailability(dto);
    const start = dto.preferredStartAt ? new Date(dto.preferredStartAt) : new Date(Date.now() + 24 * 60 * 60000);
    const end = dto.preferredEndAt ? new Date(dto.preferredEndAt) : new Date(start.getTime() + (dto.durationMinutes ?? 30) * 60000);
    const score = Math.max(0, 1 - analysis.conflictCount * 0.25);
    const recommendation = await this.prisma.meetingRecommendation.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), meetingId: dto.meetingId, calendarId: dto.calendarId, recommendationKey: `schedule-rec-${randomUUID()}`, recommendationType: analysis.conflictCount ? 'conflict_resolution' : 'optimal_slot', title: dto.title, rationale: analysis.conflictCount ? 'Preferred slot has conflicts; review suggested alternatives.' : 'Preferred slot has no detected calendar conflicts.', score, priority: score < 0.6 ? 'high' : 'medium', suggestedStartAt: start, suggestedEndAt: end, timezone: dto.timezone ?? 'UTC', participants: dto.participantRefs ?? [], conflicts: analysis.conflicts, metadata: { constraints: dto.constraints ?? {}, availabilityMatches: analysis.availabilityMatches } } });
    await this.eventBus.publish({ tenantId: this.context.currentTenantId(), workspaceId: recommendation.workspaceId ?? undefined, type: 'scheduling.recommendation.created', source: 'scheduling-engine', subject: { type: 'meeting_recommendation', id: recommendation.id }, payload: { title: recommendation.title, score: recommendation.score, recommendationType: recommendation.recommendationType }, actorUserId: this.context.context()?.userId });
    return { recommendation, analysis };
  }

  reminders(status?: string) {
    return this.prisma.reminder.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, deletedAt: null }, include: { event: true, meeting: true }, orderBy: { scheduledAt: 'asc' }, take: 150 });
  }

  async createReminder(dto: CreateReminderDto) {
    const reminder = await this.prisma.reminder.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), eventId: dto.eventId, meetingId: dto.meetingId, reminderKey: dto.reminderKey ?? `reminder-${randomUUID()}`, reminderType: dto.reminderType, channel: dto.channel ?? 'in_app', scheduledAt: new Date(dto.scheduledAt), targetUserId: dto.targetUserId ?? this.context.context()?.userId, payload: dto.payload ?? {}, metadata: dto.metadata ?? {} } });
    await this.eventBus.publish({ tenantId: this.context.currentTenantId(), workspaceId: reminder.workspaceId ?? undefined, type: 'reminder.created', source: 'reminder-engine', subject: { type: 'reminder', id: reminder.id }, payload: { reminderType: reminder.reminderType, scheduledAt: reminder.scheduledAt, channel: reminder.channel }, actorUserId: this.context.context()?.userId });
    return reminder;
  }

  dueReminders() {
    return this.prisma.reminder.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: 'scheduled', scheduledAt: { lte: new Date() }, deletedAt: null }, orderBy: { scheduledAt: 'asc' }, take: 100 });
  }

  completeReminder(id: string) {
    return this.prisma.reminder.update({ where: { id }, data: { status: 'sent', sentAt: new Date() } });
  }

  notificationPreferences(userId?: string) {
    return this.prisma.notificationPreference.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, userId: userId ?? this.context.context()?.userId ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  upsertPreference(dto: UpsertNotificationPreferenceDto) {
    return this.prisma.notificationPreference.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), userId: dto.userId ?? this.context.context()?.userId, preferenceKey: dto.preferenceKey ?? `pref-${dto.channel}-${randomUUID()}`, channel: dto.channel, scope: dto.scope ?? 'workspace', enabled: dto.enabled ?? true, quietHours: dto.quietHours ?? {}, rules: dto.rules ?? {}, metadata: dto.metadata ?? {} } });
  }

  async optimizeSchedule(dto: SchedulingRequestDto) {
    const recommendation = await this.recommendMeeting(dto);
    return { ...recommendation, optimization: { strategy: 'minimize_conflicts', conflictCount: recommendation.analysis.conflictCount, score: recommendation.recommendation.score } };
  }

  resourceScheduling(dto: SchedulingRequestDto) {
    return this.recommendMeeting({ ...dto, title: `Resource scheduling: ${dto.title}` });
  }

  private async requireCalendar(id: string) {
    const calendar = await this.prisma.calendar.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!calendar) throw new NotFoundException('Calendar not found');
    return calendar;
  }

  private async requireEvent(id: string) {
    const event = await this.prisma.calendarEvent.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!event) throw new NotFoundException('Calendar event not found');
    return event;
  }
}