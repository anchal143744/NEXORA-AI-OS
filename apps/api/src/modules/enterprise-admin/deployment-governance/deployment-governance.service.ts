import { Injectable, NotFoundException } from '@nestjs/common';
import { EventBusService } from '../../events/event-bus.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateChangeRequestDto, CreateEnvironmentDto, CreateFeatureFlagDto, CreateReleaseDto, UpdateFeatureFlagDto } from '../dto/enterprise-admin.dto';

@Injectable()
export class DeploymentGovernanceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  environments() { return this.prisma.deploymentEnvironment.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, orderBy: { createdAt: 'desc' } }); }
  createEnvironment(dto: CreateEnvironmentDto) { return this.prisma.deploymentEnvironment.create({ data: { tenantId: this.context.currentTenantId(), name: dto.name, slug: dto.slug, environmentType: dto.environmentType, region: dto.region, currentVersion: dto.currentVersion, approvalsRequired: dto.approvalsRequired ?? true, variables: dto.variables ?? {}, metadata: dto.metadata ?? {} } }); }

  releases(status?: string) { return this.prisma.releaseControl.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' } }); }
  createRelease(dto: CreateReleaseDto) { return this.prisma.releaseControl.create({ data: { tenantId: this.context.currentTenantId(), environmentId: dto.environmentId, version: dto.version, releaseType: dto.releaseType, changeSummary: dto.changeSummary, rollbackTargetVersion: dto.rollbackTargetVersion, approvalPolicy: dto.approvalPolicy ?? { required: true, approvers: ['admin'] }, metadata: dto.metadata ?? {} } }); }

  async approveRelease(id: string) {
    const tenantId = this.context.currentTenantId();
    const release = await this.prisma.releaseControl.findFirst({ where: { tenantId, id, deletedAt: null } });
    if (!release) throw new NotFoundException('Release not found');
    const approved = await this.prisma.releaseControl.update({ where: { id }, data: { status: 'approved', approvedByUserId: this.context.context()?.userId } });
    await this.prisma.adminOperation.create({ data: { tenantId, operationType: 'release.approved', targetType: 'release', targetId: id, status: 'completed', requestedByUserId: this.context.context()?.userId, approvedByUserId: this.context.context()?.userId, metadata: { version: release.version, environmentId: release.environmentId } } });
    await this.events.publish({ tenantId, type: 'release.approved', source: 'deployment-governance', subject: { type: 'release', id }, payload: { version: release.version, environmentId: release.environmentId }, actorUserId: this.context.context()?.userId });
    return approved;
  }

  async rollbackRelease(id: string, targetVersion?: string) {
    const tenantId = this.context.currentTenantId();
    const release = await this.prisma.releaseControl.findFirst({ where: { tenantId, id, deletedAt: null } });
    if (!release) throw new NotFoundException('Release not found');
    const rolledBack = await this.prisma.releaseControl.update({ where: { id }, data: { status: 'rolled_back', rolledBackAt: new Date(), rollbackTargetVersion: targetVersion ?? release.rollbackTargetVersion } });
    if (release.environmentId && (targetVersion ?? release.rollbackTargetVersion)) await this.prisma.deploymentEnvironment.update({ where: { id: release.environmentId }, data: { currentVersion: targetVersion ?? release.rollbackTargetVersion } });
    await this.prisma.adminOperation.create({ data: { tenantId, operationType: 'release.rolled_back', targetType: 'release', targetId: id, status: 'completed', requestedByUserId: this.context.context()?.userId, metadata: { version: release.version, targetVersion: targetVersion ?? release.rollbackTargetVersion } } });
    await this.events.publish({ tenantId, type: 'release.rolled_back', source: 'deployment-governance', subject: { type: 'release', id }, payload: { version: release.version, targetVersion: targetVersion ?? release.rollbackTargetVersion }, actorUserId: this.context.context()?.userId });
    return rolledBack;
  }

  featureFlags() { return this.prisma.featureFlag.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, orderBy: { updatedAt: 'desc' } }); }
  createFeatureFlag(dto: CreateFeatureFlagDto) { return this.prisma.featureFlag.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), flagKey: dto.flagKey, name: dto.name, description: dto.description, enabled: dto.enabled ?? false, rolloutStrategy: dto.rolloutStrategy ?? { type: 'manual' }, rules: dto.rules ?? [], metadata: dto.metadata ?? {} } }); }

  async updateFeatureFlag(id: string, dto: UpdateFeatureFlagDto) {
    const tenantId = this.context.currentTenantId();
    const flag = await this.prisma.featureFlag.findFirst({ where: { tenantId, id, deletedAt: null } });
    if (!flag) throw new NotFoundException('Feature flag not found');
    const updated = await this.prisma.featureFlag.update({ where: { id }, data: { enabled: dto.enabled, rolloutStrategy: dto.rolloutStrategy, rules: dto.rules, metadata: dto.metadata } });
    await this.events.publish({ tenantId, workspaceId: updated.workspaceId ?? undefined, type: 'feature_flag.updated', source: 'deployment-governance', subject: { type: 'feature_flag', id }, payload: { flagKey: updated.flagKey, enabled: updated.enabled }, actorUserId: this.context.context()?.userId });
    return updated;
  }

  changeRequests(status?: string) { return this.prisma.changeRequest.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' } }); }
  createChangeRequest(dto: CreateChangeRequestDto) { return this.prisma.changeRequest.create({ data: { tenantId: this.context.currentTenantId(), environmentId: dto.environmentId, releaseId: dto.releaseId, title: dto.title, changeType: dto.changeType, riskLevel: dto.riskLevel ?? 'medium', requestedByUserId: this.context.context()?.userId, impactAssessment: dto.impactAssessment ?? {}, rollbackPlan: dto.rollbackPlan ?? {}, metadata: dto.metadata ?? {} } }); }
}
