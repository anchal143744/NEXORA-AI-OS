import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateDataTransferRuleDto, CreateResidencyAssignmentDto, CreateResidencyPolicyDto, CreateSovereigntyRuleDto } from './dto/data-residency.dto';

@Injectable()
export class ResidencyPolicyService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  policies(policyType?: string, status?: string, enforcementMode?: string) {
    return this.prisma.residencyPolicy.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, policyType: policyType ?? undefined, status: status ?? undefined, enforcementMode: enforcementMode ?? undefined, deletedAt: null }, include: { dataRegion: true, assignments: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createPolicy(dto: CreateResidencyPolicyDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.residencyPolicy.create({ data: { tenantId, workspaceId, dataRegionId: dto.dataRegionId, policyKey: dto.policyKey ?? `residency-policy-${randomUUID()}`, name: dto.name, policyType: dto.policyType ?? 'residency', status: dto.status ?? 'active', enforcementMode: dto.enforcementMode ?? 'monitor', dataClasses: dto.dataClasses ?? [], allowedRegions: dto.allowedRegions ?? [], restrictedRegions: dto.restrictedRegions ?? [], retentionRules: dto.retentionRules ?? {}, ownerUserId: dto.ownerUserId, effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date(), effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'residency.policy.created', source: 'data-residency', subject: { type: 'residency_policy', id: record.id }, payload: { policyType: record.policyType, enforcementMode: record.enforcementMode, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  sovereigntyRules(countryCode?: string, jurisdiction?: string, status?: string) {
    return this.prisma.sovereigntyRule.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, countryCode: countryCode ?? undefined, jurisdiction: jurisdiction ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createSovereigntyRule(dto: CreateSovereigntyRuleDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.sovereigntyRule.create({ data: { tenantId, workspaceId, ruleKey: dto.ruleKey ?? `sovereignty-rule-${randomUUID()}`, name: dto.name, countryCode: dto.countryCode, jurisdiction: dto.jurisdiction, ruleType: dto.ruleType ?? 'processing', status: dto.status ?? 'active', enforcementMode: dto.enforcementMode ?? 'monitor', conditions: dto.conditions ?? [], restrictions: dto.restrictions ?? [], exceptions: dto.exceptions ?? [], effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : new Date(), effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'sovereignty.rule.created', source: 'data-residency', subject: { type: 'sovereignty_rule', id: record.id }, payload: { countryCode: record.countryCode, jurisdiction: record.jurisdiction, ruleType: record.ruleType, enforcementMode: record.enforcementMode }, actorUserId: this.context.context()?.userId });
    return record;
  }

  transferRules(transferType?: string, status?: string, allowed?: boolean) {
    return this.prisma.dataTransferRule.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, transferType: transferType ?? undefined, status: status ?? undefined, allowed: allowed ?? undefined, deletedAt: null }, include: { sourceRegion: true, destinationRegion: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createTransferRule(dto: CreateDataTransferRuleDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.dataTransferRule.create({ data: { tenantId, workspaceId, sourceRegionId: dto.sourceRegionId, destinationRegionId: dto.destinationRegionId, ruleKey: dto.ruleKey ?? `data-transfer-rule-${randomUUID()}`, transferType: dto.transferType ?? 'cross_border', status: dto.status ?? 'active', allowed: dto.allowed ?? false, dataClasses: dto.dataClasses ?? [], safeguards: dto.safeguards ?? [], approvalRequired: dto.approvalRequired ?? true, legalBasis: dto.legalBasis, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'data.transfer.rule.created', source: 'data-residency', subject: { type: 'data_transfer_rule', id: record.id }, payload: { transferType: record.transferType, allowed: record.allowed, approvalRequired: record.approvalRequired }, actorUserId: this.context.context()?.userId });
    return record;
  }

  assignments(subjectType?: string, dataClass?: string, residencyStatus?: string) {
    return this.prisma.residencyAssignment.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, subjectType: subjectType ?? undefined, dataClass: dataClass ?? undefined, residencyStatus: residencyStatus ?? undefined, deletedAt: null }, include: { dataRegion: true, policy: true }, orderBy: { assignedAt: 'desc' }, take: 100 });
  }

  async createAssignment(dto: CreateResidencyAssignmentDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.residencyAssignment.create({ data: { tenantId, workspaceId, dataRegionId: dto.dataRegionId, policyId: dto.policyId, assignmentKey: dto.assignmentKey ?? `residency-assignment-${randomUUID()}`, subjectType: dto.subjectType, subjectId: dto.subjectId, dataClass: dto.dataClass, residencyStatus: dto.residencyStatus ?? 'assigned', assignedRegion: dto.assignedRegion, enforcementMode: dto.enforcementMode ?? 'monitor', assignedAt: dto.assignedAt ? new Date(dto.assignedAt) : new Date(), expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'residency.assignment.created', source: 'data-residency', subject: { type: 'residency_assignment', id: record.id }, payload: { subjectType: record.subjectType, dataClass: record.dataClass, assignedRegion: record.assignedRegion, residencyStatus: record.residencyStatus }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async sovereigntyDashboard() {
    const [policies, rules, transfers, assignments] = await Promise.all([this.policies(), this.sovereigntyRules(), this.transferRules(), this.assignments()]);
    return { policies, rules, transfers, assignments, summary: { activePolicyCount: policies.filter((policy: { status: string }) => policy.status === 'active').length, sovereigntyRuleCount: rules.length, blockedTransferCount: transfers.filter((rule: { allowed: boolean }) => !rule.allowed).length, assignmentCount: assignments.length } };
  }
}