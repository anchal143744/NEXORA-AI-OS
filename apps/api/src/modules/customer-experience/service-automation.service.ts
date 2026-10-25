import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateServiceEscalationDto, CreateServiceTicketDto, CreateSlaRecordDto, ResolveServiceTicketDto } from './dto/customer-experience.dto';

@Injectable()
export class ServiceAutomationService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  tickets(status?: string, customerIdentityId?: string) {
    return this.prisma.serviceTicket.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, customerIdentityId: customerIdentityId ?? undefined, deletedAt: null }, orderBy: [{ priority: 'asc' }, { updatedAt: 'desc' }], take: 150 });
  }

  async createTicket(dto: CreateServiceTicketDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const ticket = await this.prisma.serviceTicket.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, ticketKey: dto.ticketKey ?? `ticket-${randomUUID()}`, title: dto.title, description: dto.description, ticketType: dto.ticketType ?? 'support', status: dto.status ?? 'open', priority: dto.priority ?? 'normal', severity: dto.severity ?? 'medium', source: dto.source ?? 'manual', queueId: dto.queueId, assignedUserId: dto.assignedUserId ?? this.context.context()?.userId, conversationId: dto.conversationId, slaDueAt: dto.slaDueAt ? new Date(dto.slaDueAt) : undefined, tags: dto.tags ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'service.ticket.created', source: 'service-automation', subject: { type: 'service_ticket', id: ticket.id }, payload: { title: ticket.title, priority: ticket.priority, severity: ticket.severity }, actorUserId: this.context.context()?.userId });
    return ticket;
  }

  async getTicket(id: string) {
    const ticket = await this.requireTicket(id);
    const [escalations, resolutions, slaRecords] = await Promise.all([this.escalations(id), this.resolutions(id), this.slaRecords(id)]);
    return { ...ticket, escalations, resolutions, slaRecords };
  }

  async escalateTicket(ticketId: string, dto: CreateServiceEscalationDto) {
    await this.requireTicket(ticketId);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const escalation = await this.prisma.serviceEscalation.create({ data: { tenantId, workspaceId, ticketId, escalationKey: dto.escalationKey ?? `service-escalation-${randomUUID()}`, escalationType: dto.escalationType ?? 'sla', severity: dto.severity ?? 'high', reason: dto.reason, fromUserId: dto.fromUserId ?? this.context.context()?.userId, toUserId: dto.toUserId, recommendedAction: dto.recommendedAction, metadata: dto.metadata ?? {} } });
    await this.prisma.serviceTicket.update({ where: { id: ticketId }, data: { status: 'escalated', priority: escalation.severity === 'critical' ? 'critical' : 'high' } });
    await this.events.publish({ tenantId, workspaceId, type: 'service.escalated', source: 'service-automation', subject: { type: 'service_escalation', id: escalation.id }, payload: { ticketId, severity: escalation.severity, reason: escalation.reason }, actorUserId: this.context.context()?.userId });
    return escalation;
  }

  escalations(ticketId?: string) {
    return this.prisma.serviceEscalation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, ticketId: ticketId ?? undefined, deletedAt: null }, orderBy: { escalatedAt: 'desc' }, take: 100 });
  }

  async resolveTicket(ticketId: string, dto: ResolveServiceTicketDto) {
    await this.requireTicket(ticketId);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const resolution = await this.prisma.serviceResolution.create({ data: { tenantId, workspaceId, ticketId, resolutionKey: dto.resolutionKey ?? `resolution-${randomUUID()}`, resolutionType: dto.resolutionType ?? 'standard', summary: dto.summary, rootCause: dto.rootCause, actionsTaken: dto.actionsTaken ?? [], customerImpact: dto.customerImpact, resolvedByUserId: dto.resolvedByUserId ?? this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    await this.prisma.serviceTicket.update({ where: { id: ticketId }, data: { status: 'resolved', resolvedAt: new Date() } });
    await this.events.publish({ tenantId, workspaceId, type: 'service.ticket.resolved', source: 'service-automation', subject: { type: 'service_resolution', id: resolution.id }, payload: { ticketId, resolutionType: resolution.resolutionType }, actorUserId: this.context.context()?.userId });
    return resolution;
  }

  resolutions(ticketId?: string) {
    return this.prisma.serviceResolution.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, ticketId: ticketId ?? undefined, deletedAt: null }, orderBy: { resolvedAt: 'desc' }, take: 100 });
  }

  async createSlaRecord(dto: CreateSlaRecordDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const targetAt = new Date(dto.targetAt);
    const achievedAt = dto.achievedAt ? new Date(dto.achievedAt) : undefined;
    const breachedAt = achievedAt && achievedAt > targetAt ? achievedAt : undefined;
    const record = await this.prisma.sLARecord.create({ data: { tenantId, workspaceId, ticketId: dto.ticketId, customerIdentityId: dto.customerIdentityId, slaKey: dto.slaKey ?? `sla-${randomUUID()}`, slaType: dto.slaType ?? 'first_response', status: breachedAt ? 'breached' : dto.status ?? 'active', targetAt, achievedAt, breachedAt, targetSeconds: dto.targetSeconds, actualSeconds: dto.actualSeconds, breachReason: dto.breachReason, policy: dto.policy ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'sla.record.created', source: 'sla-monitoring', subject: { type: 'sla_record', id: record.id }, payload: { slaType: record.slaType, status: record.status, ticketId: record.ticketId }, actorUserId: this.context.context()?.userId });
    return record;
  }

  slaRecords(ticketId?: string, status?: string) {
    return this.prisma.sLARecord.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, ticketId: ticketId ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { targetAt: 'asc' }, take: 150 });
  }

  breachedSla() {
    return this.prisma.sLARecord.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, OR: [{ status: 'breached' }, { targetAt: { lt: new Date() }, achievedAt: null }], deletedAt: null }, orderBy: { targetAt: 'asc' }, take: 100 });
  }

  async serviceAnalytics() {
    const [tickets, escalations, breached] = await Promise.all([this.tickets(), this.escalations(), this.breachedSla()]);
    return { ticketCount: tickets.length, openTickets: tickets.filter((ticket: { status: string }) => ticket.status !== 'resolved' && ticket.status !== 'closed').length, escalationCount: escalations.length, breachedSlaCount: breached.length };
  }

  serviceWorkflows() {
    return [{ key: 'ticket_triage', status: 'ready' }, { key: 'sla_escalation', status: 'ready' }, { key: 'resolution_follow_up', status: 'ready' }];
  }

  private async requireTicket(id: string) {
    const ticket = await this.prisma.serviceTicket.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!ticket) throw new NotFoundException('Service ticket not found');
    return ticket;
  }
}
