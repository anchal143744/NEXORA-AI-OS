import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateSecurityThreatDto, CreateThreatDetectionRuleDto, CreateThreatEventDto } from './dto/security-intelligence.dto';

@Injectable()
export class ThreatDetectionService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  rules(ruleType?: string, status?: string, severity?: string) {
    return this.prisma.threatDetectionRule.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, ruleType: ruleType ?? undefined, status: status ?? undefined, severity: severity ?? undefined, deletedAt: null }, include: { events: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createRule(dto: CreateThreatDetectionRuleDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.threatDetectionRule.create({ data: { tenantId, workspaceId, ruleKey: dto.ruleKey ?? `threat-rule-${randomUUID()}`, name: dto.name, ruleType: dto.ruleType ?? 'behavioral', severity: dto.severity ?? 'medium', status: dto.status ?? 'active', logic: dto.logic ?? {}, conditions: dto.conditions ?? [], actions: dto.actions ?? [], falsePositiveRate: dto.falsePositiveRate, lastTriggeredAt: dto.lastTriggeredAt ? new Date(dto.lastTriggeredAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'threat.rule.created', source: 'security-intelligence', subject: { type: 'threat_detection_rule', id: record.id }, payload: { ruleKey: record.ruleKey, ruleType: record.ruleType, severity: record.severity, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  threats(threatType?: string, severity?: string, status?: string) {
    return this.prisma.securityThreat.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, threatType: threatType ?? undefined, severity: severity ?? undefined, status: status ?? undefined, deletedAt: null }, include: { events: true, alerts: true, risks: true }, orderBy: { firstSeenAt: 'desc' }, take: 100 });
  }

  async createThreat(dto: CreateSecurityThreatDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.securityThreat.create({ data: { tenantId, workspaceId, threatKey: dto.threatKey ?? `security-threat-${randomUUID()}`, name: dto.name, threatType: dto.threatType ?? 'unknown', severity: dto.severity ?? 'medium', status: dto.status ?? 'active', source: dto.source ?? 'threat_detection', confidence: dto.confidence, indicators: dto.indicators ?? [], tactics: dto.tactics ?? [], mitigation: dto.mitigation ?? [], firstSeenAt: dto.firstSeenAt ? new Date(dto.firstSeenAt) : new Date(), lastSeenAt: dto.lastSeenAt ? new Date(dto.lastSeenAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'security.threat.detected', source: 'security-intelligence', subject: { type: 'security_threat', id: record.id }, payload: { threatKey: record.threatKey, threatType: record.threatType, severity: record.severity, confidence: record.confidence }, actorUserId: this.context.context()?.userId });
    return record;
  }

  eventsList(eventType?: string, severity?: string, status?: string) {
    return this.prisma.threatEvent.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, eventType: eventType ?? undefined, severity: severity ?? undefined, status: status ?? undefined, deletedAt: null }, include: { threat: true, rule: true, incident: true }, orderBy: { occurredAt: 'desc' }, take: 100 });
  }

  async createThreatEvent(dto: CreateThreatEventDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    if (dto.threatId) await this.ensureThreat(dto.threatId, tenantId, workspaceId);
    if (dto.ruleId) await this.ensureRule(dto.ruleId, tenantId, workspaceId);
    const record = await this.prisma.threatEvent.create({ data: { tenantId, workspaceId, eventKey: dto.eventKey ?? `threat-event-${randomUUID()}`, threatId: dto.threatId, ruleId: dto.ruleId, incidentId: dto.incidentId, eventType: dto.eventType, severity: dto.severity ?? 'medium', status: dto.status ?? 'new', source: dto.source ?? 'threat_detection', occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(), indicators: dto.indicators ?? [], payload: dto.payload ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'threat.event.created', source: 'security-intelligence', subject: { type: 'threat_event', id: record.id }, payload: { eventKey: record.eventKey, eventType: record.eventType, severity: record.severity, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async monitoring() {
    const [rules, threats, events] = await Promise.all([this.rules(), this.threats(), this.eventsList()]);
    return { rules, threats, events, summary: { ruleCount: rules.length, activeThreatCount: threats.filter((threat: { status: string }) => threat.status === 'active').length, criticalEventCount: events.filter((event: { severity: string }) => event.severity === 'critical').length } };
  }

  private async ensureThreat(id: string, tenantId: string, workspaceId?: string | null) {
    const record = await this.prisma.securityThreat.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!record) throw new NotFoundException('Security threat not found');
  }

  private async ensureRule(id: string, tenantId: string, workspaceId?: string | null) {
    const record = await this.prisma.threatDetectionRule.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!record) throw new NotFoundException('Threat detection rule not found');
  }
}