import { Injectable, NotFoundException } from '@nestjs/common';
import { EventBusService } from '../../events/event-bus.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { DecideWorkflowApprovalDto, RequestWorkflowApprovalDto } from '../dto/workflow-builder.dto';

@Injectable()
export class WorkflowApprovalService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  list(status = 'pending') {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    return this.prisma.workflowApproval.findMany({ where: { tenantId, workspaceId, status, deletedAt: null }, include: { workflow: true, execution: true, approver: true }, orderBy: { requestedAt: 'asc' } });
  }

  async request(dto: RequestWorkflowApprovalDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    const approval = await this.prisma.workflowApproval.create({ data: { tenantId, workspaceId, workflowId: dto.workflowId, workflowExecutionId: dto.workflowExecutionId, nodeKey: dto.nodeKey, approvalType: dto.approvalType, approverRole: dto.approverRole, approverUserId: dto.approverUserId, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, metadata: dto.metadata ?? {} } });
    if (dto.workflowExecutionId) await this.prisma.workflowExecution.update({ where: { id: dto.workflowExecutionId }, data: { approvalStatus: 'pending', status: 'WAITING' } });
    await this.prisma.workflowAudit.create({ data: { tenantId, workspaceId, workflowId: dto.workflowId, workflowExecutionId: dto.workflowExecutionId, actorUserId: this.context.context()?.userId, action: 'workflow.approval.requested', resourceType: 'workflow_approval', resourceId: approval.id, after: approval as object } });
    await this.events.publish({ tenantId, workspaceId, type: 'workflow.approval.requested', source: 'workflow-approval-service', subject: { type: 'workflow_approval', id: approval.id }, payload: { approvalType: dto.approvalType, workflowId: dto.workflowId, workflowExecutionId: dto.workflowExecutionId }, actorUserId: this.context.context()?.userId });
    return approval;
  }

  async decide(id: string, dto: DecideWorkflowApprovalDto) {
    const tenantId = this.context.currentTenantId();
    const before = await this.prisma.workflowApproval.findFirst({ where: { tenantId, id, deletedAt: null } });
    if (!before) throw new NotFoundException('Workflow approval not found');
    const approval = await this.prisma.workflowApproval.update({ where: { id }, data: { status: dto.decision, decisionReason: dto.reason, decidedAt: new Date() } });
    if (approval.workflowExecutionId) await this.prisma.workflowExecution.update({ where: { id: approval.workflowExecutionId }, data: { approvalStatus: dto.decision, status: dto.decision === 'approved' ? 'QUEUED' : 'CANCELED' } });
    await this.prisma.workflowAudit.create({ data: { tenantId, workspaceId: approval.workspaceId, workflowId: approval.workflowId, workflowExecutionId: approval.workflowExecutionId, actorUserId: this.context.context()?.userId, action: 'workflow.approval.decided', resourceType: 'workflow_approval', resourceId: approval.id, before: before as object, after: approval as object } });
    await this.events.publish({ tenantId, workspaceId: approval.workspaceId ?? undefined, type: 'workflow.approval.decided', source: 'workflow-approval-service', subject: { type: 'workflow_approval', id: approval.id }, payload: { decision: dto.decision, workflowId: approval.workflowId, workflowExecutionId: approval.workflowExecutionId }, actorUserId: this.context.context()?.userId });
    return approval;
  }
}
