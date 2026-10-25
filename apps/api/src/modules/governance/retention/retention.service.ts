import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateRetentionPolicyDto } from '../dto/governance.dto';

@Injectable()
export class RetentionService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  policies(recordType?: string, enabled?: string) {
    return this.prisma.recordsLifecyclePolicy.findMany({ where: { tenantId: this.context.currentTenantId(), recordType: recordType ?? undefined, enabled: enabled === undefined ? undefined : enabled === 'true', deletedAt: null }, include: { actions: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 5 }, archiveJobs: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 3 } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createPolicy(dto: CreateRetentionPolicyDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const policy = await this.prisma.recordsLifecyclePolicy.create({ data: { tenantId, workspaceId, policyKey: dto.policyKey ?? `retention-${dto.recordType}-${randomUUID()}`, recordType: dto.recordType, classification: dto.classification, retentionDays: dto.retentionDays, archiveAfterDays: dto.archiveAfterDays, deletionMode: dto.deletionMode ?? 'soft_delete', recoveryWindowDays: dto.recoveryWindowDays ?? 30, legalHoldExempt: dto.legalHoldExempt ?? true, enabled: dto.enabled ?? true, rules: dto.rules ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'retention.policy.created', source: 'retention-engine', subject: { type: 'records_lifecycle_policy', id: policy.id }, payload: { policyKey: policy.policyKey, recordType: policy.recordType, retentionDays: policy.retentionDays }, actorUserId: this.context.context()?.userId });
    return policy;
  }

  async schedule(recordType?: string) {
    const policies = await this.policies(recordType, 'true');
    return policies.map((policy: any) => ({ policyId: policy.id, policyKey: policy.policyKey, recordType: policy.recordType, retainUntil: this.daysFromNow(policy.retentionDays), archiveAfter: policy.archiveAfterDays ? this.daysFromNow(policy.archiveAfterDays) : null, deletionMode: policy.deletionMode, recoveryWindowDays: policy.recoveryWindowDays }));
  }

  async evaluate(recordType: string, recordCreatedAt?: string) {
    const policy = await this.prisma.recordsLifecyclePolicy.findFirst({ where: { tenantId: this.context.currentTenantId(), recordType, enabled: true, deletedAt: null }, orderBy: { updatedAt: 'desc' } });
    if (!policy) throw new NotFoundException('Retention policy not found for record type');
    const createdAt = recordCreatedAt ? new Date(recordCreatedAt) : new Date();
    const archiveAt = policy.archiveAfterDays ? new Date(createdAt.getTime() + policy.archiveAfterDays * 86400000) : undefined;
    const deleteAt = new Date(createdAt.getTime() + policy.retentionDays * 86400000);
    const recoveryExpiresAt = new Date(deleteAt.getTime() + policy.recoveryWindowDays * 86400000);
    return { policy, recordCreatedAt: createdAt, archiveAt, deleteAt, recoveryExpiresAt, legalHoldExempt: policy.legalHoldExempt };
  }

  private daysFromNow(days: number) { const date = new Date(); date.setDate(date.getDate() + days); return date.toISOString(); }
}