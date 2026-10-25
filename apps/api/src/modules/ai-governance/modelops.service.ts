import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateAIModelDeploymentDto, CreateModelApprovalWorkflowDto, DecideModelApprovalDto } from './dto/ai-governance.dto';

@Injectable()
export class ModelOpsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  deployments(environment?: string, status?: string, healthStatus?: string) {
    return this.prisma.aIModelDeployment.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, environment: environment ?? undefined, status: status ?? undefined, healthStatus: healthStatus ?? undefined, deletedAt: null }, include: { aiModel: true, modelVersion: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createDeployment(dto: CreateAIModelDeploymentDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    await this.ensureModel(dto.aiModelId, tenantId, workspaceId);
    const record = await this.prisma.aIModelDeployment.create({ data: { tenantId, workspaceId, aiModelId: dto.aiModelId, modelVersionId: dto.modelVersionId, deploymentKey: dto.deploymentKey ?? `ai-model-deployment-${randomUUID()}`, environment: dto.environment ?? 'production', status: dto.status ?? 'pending', endpoint: dto.endpoint, trafficPercent: dto.trafficPercent ?? 0, rollbackVersionId: dto.rollbackVersionId, deployedAt: dto.deployedAt ? new Date(dto.deployedAt) : undefined, retiredAt: dto.retiredAt ? new Date(dto.retiredAt) : undefined, healthStatus: dto.healthStatus ?? 'unknown', runtimeConfig: dto.runtimeConfig ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'ai.model.deployment.created', source: 'ai-governance', subject: { type: 'ai_model_deployment', id: record.id }, payload: { aiModelId: record.aiModelId, environment: record.environment, status: record.status, healthStatus: record.healthStatus }, actorUserId: this.context.context()?.userId });
    return record;
  }

  approvals(status?: string, workflowType?: string, riskTier?: string) {
    return this.prisma.modelApprovalWorkflow.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, workflowType: workflowType ?? undefined, riskTier: riskTier ?? undefined, deletedAt: null }, include: { aiModel: true, modelVersion: true, deployment: true }, orderBy: { requestedAt: 'desc' }, take: 100 });
  }

  async createApprovalWorkflow(dto: CreateModelApprovalWorkflowDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.modelApprovalWorkflow.create({ data: { tenantId, workspaceId, aiModelId: dto.aiModelId, modelVersionId: dto.modelVersionId, deploymentId: dto.deploymentId, workflowKey: dto.workflowKey ?? `model-approval-${randomUUID()}`, workflowType: dto.workflowType ?? 'model_release', status: dto.status ?? 'pending', riskTier: dto.riskTier ?? 'medium', requestedByUserId: dto.requestedByUserId ?? this.context.context()?.userId, approvedByUserId: dto.approvedByUserId, steps: dto.steps ?? this.defaultSteps(dto.riskTier), decision: dto.decision ?? {}, requestedAt: dto.requestedAt ? new Date(dto.requestedAt) : new Date(), resolvedAt: dto.resolvedAt ? new Date(dto.resolvedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'model.approval.workflow.created', source: 'ai-governance', subject: { type: 'model_approval_workflow', id: record.id }, payload: { workflowType: record.workflowType, status: record.status, riskTier: record.riskTier }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async decideApprovalWorkflow(id: string, dto: DecideModelApprovalDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId() ?? undefined;
    const existing = await this.prisma.modelApprovalWorkflow.findFirst({ where: { id, tenantId, workspaceId, deletedAt: null } });
    if (!existing) throw new NotFoundException('Model approval workflow not found');
    const record = await this.prisma.modelApprovalWorkflow.update({ where: { id }, data: { status: dto.status, approvedByUserId: dto.approvedByUserId ?? this.context.context()?.userId, decision: dto.decision ?? {}, resolvedAt: new Date() } });
    await this.events.publish({ tenantId, workspaceId, type: 'model.approval.workflow.decided', source: 'ai-governance', subject: { type: 'model_approval_workflow', id: record.id }, payload: { status: record.status, riskTier: record.riskTier, decision: record.decision }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async lifecycle() {
    const [deployments, approvals] = await Promise.all([this.deployments(), this.approvals()]);
    return { deployments, approvals, summary: { deploymentCount: deployments.length, pendingApprovals: approvals.filter((approval: { status: string }) => approval.status === 'pending').length, unhealthyDeployments: deployments.filter((deployment: { healthStatus: string }) => ['degraded', 'failed'].includes(deployment.healthStatus)).length } };
  }

  private defaultSteps(riskTier?: string) { return ['high', 'critical'].includes(riskTier ?? '') ? [{ step: 'manager_review' }, { step: 'security_review' }, { step: 'executive_approval' }] : [{ step: 'owner_review' }]; }
  private async ensureModel(id: string, tenantId: string, workspaceId?: string | null) {
    const record = await this.prisma.aIModel.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!record) throw new NotFoundException('AI model not found');
  }
}