import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateAccessVerificationDto, CreateZeroTrustPolicyDto } from './dto/security-intelligence.dto';

@Injectable()
export class ZeroTrustService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  policies(policyType?: string, status?: string, enforcementMode?: string) {
    return this.prisma.zeroTrustPolicy.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, policyType: policyType ?? undefined, status: status ?? undefined, enforcementMode: enforcementMode ?? undefined, deletedAt: null }, include: { accessVerifications: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createPolicy(dto: CreateZeroTrustPolicyDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.zeroTrustPolicy.create({ data: { tenantId, workspaceId, policyKey: dto.policyKey ?? `zero-trust-policy-${randomUUID()}`, name: dto.name, policyType: dto.policyType ?? 'adaptive_access', status: dto.status ?? 'active', enforcementMode: dto.enforcementMode ?? 'monitor', conditions: dto.conditions ?? [], actions: dto.actions ?? [], riskThreshold: dto.riskThreshold, appliesTo: dto.appliesTo ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'zero_trust.policy.created', source: 'security-intelligence', subject: { type: 'zero_trust_policy', id: record.id }, payload: { policyKey: record.policyKey, policyType: record.policyType, enforcementMode: record.enforcementMode, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  verifications(decision?: string, trustLevel?: string, resourceType?: string) {
    return this.prisma.accessVerification.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, decision: decision ?? undefined, trustLevel: trustLevel ?? undefined, resourceType: resourceType ?? undefined, deletedAt: null }, include: { policy: true }, orderBy: { verifiedAt: 'desc' }, take: 100 });
  }

  async createVerification(dto: CreateAccessVerificationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    if (dto.policyId) await this.ensurePolicy(dto.policyId, tenantId, workspaceId);
    const trustLevel = dto.trustLevel ?? this.trustLevel(dto.riskScore);
    const decision = dto.decision ?? this.decision(dto.riskScore);
    const record = await this.prisma.accessVerification.create({ data: { tenantId, workspaceId, policyId: dto.policyId, verificationKey: dto.verificationKey ?? `access-verification-${randomUUID()}`, userId: dto.userId ?? this.context.context()?.userId, deviceId: dto.deviceId, resourceType: dto.resourceType, resourceId: dto.resourceId, decision, riskScore: dto.riskScore, trustLevel, reasons: dto.reasons ?? [], context: dto.context ?? {}, verifiedAt: dto.verifiedAt ? new Date(dto.verifiedAt) : new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'access.verification.created', source: 'security-intelligence', subject: { type: 'access_verification', id: record.id }, payload: { resourceType: record.resourceType, decision: record.decision, riskScore: record.riskScore, trustLevel: record.trustLevel }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async accessLayer() {
    const [policies, verifications] = await Promise.all([this.policies(), this.verifications()]);
    return { policies, verifications, summary: { activePolicyCount: policies.filter((policy: { status: string }) => policy.status === 'active').length, deniedVerificationCount: verifications.filter((verification: { decision: string }) => verification.decision === 'deny').length, stepUpVerificationCount: verifications.filter((verification: { decision: string }) => verification.decision === 'step_up').length } };
  }

  private trustLevel(riskScore?: number) { return Number(riskScore ?? 0) >= 0.8 ? 'low' : Number(riskScore ?? 0) >= 0.45 ? 'medium' : 'high'; }
  private decision(riskScore?: number) { return Number(riskScore ?? 0) >= 0.85 ? 'deny' : Number(riskScore ?? 0) >= 0.55 ? 'step_up' : 'allow'; }

  private async ensurePolicy(id: string, tenantId: string, workspaceId?: string | null) {
    const record = await this.prisma.zeroTrustPolicy.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!record) throw new NotFoundException('Zero trust policy not found');
  }
}