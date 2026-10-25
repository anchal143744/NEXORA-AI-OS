import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { DecideApprovalDto } from '../dto/agent-execution.dto';
import { AgentAuditTrailService } from '../audit/agent-audit-trail.service';

@Injectable()
export class AgentApprovalService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly audit: AgentAuditTrailService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId() { return this.context.currentWorkspaceId(); }
  private userId() { return this.context.context()?.userId; }

  policyForRisk(riskLevel: string) {
    if (riskLevel === 'low') return { approvalStatus: 'not_required', levels: [] };
    if (riskLevel === 'medium') return { approvalStatus: 'required', levels: [{ approvalLevel: 'manager', approverRole: 'manager' }] };
    if (riskLevel === 'high') return { approvalStatus: 'required', levels: [{ approvalLevel: 'executive', approverRole: 'executive' }] };
    return { approvalStatus: 'required', levels: [{ approvalLevel: 'manager', approverRole: 'manager' }, { approvalLevel: 'executive', approverRole: 'executive' }] };
  }

  async requestApprovals(execution: any) {
    const policy = this.policyForRisk(execution.riskLevel);
    if (!policy.levels.length) return [];
    const approvals = [];
    for (const level of policy.levels) {
      approvals.push(await this.prisma.aiAgentApproval.create({ data: { tenantId: this.tenantId(), workspaceId: execution.workspaceId ?? this.workspaceId(), executionId: execution.id, approvalLevel: level.approvalLevel, approverRole: level.approverRole, status: 'pending', expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48) } }));
    }
    await this.audit.record({ agentId: execution.agentId, executionId: execution.id, action: 'ai.agent.approval_requested', riskLevel: execution.riskLevel, metadata: { levels: policy.levels } });
    return approvals;
  }

  async decide(dto: DecideApprovalDto) {
    const approval = await this.prisma.aiAgentApproval.findFirst({ where: { tenantId: this.tenantId(), id: dto.approvalId, deletedAt: null } });
    if (!approval) throw new NotFoundException('Agent approval not found');
    const updated = await this.prisma.aiAgentApproval.update({ where: { id: approval.id }, data: { status: dto.status, approverUserId: this.userId(), decidedAt: new Date(), decisionReason: dto.decisionReason } });
    const execution = await this.prisma.aiAgentExecution.findFirst({ where: { tenantId: this.tenantId(), id: approval.executionId, deletedAt: null } });
    if (execution) {
      if (dto.status === 'rejected') await this.prisma.aiAgentExecution.update({ where: { id: execution.id }, data: { status: 'rejected', approvalStatus: 'rejected', finishedAt: new Date() } });
      else if (await this.isFullyApproved(execution.id)) await this.prisma.aiAgentExecution.update({ where: { id: execution.id }, data: { approvalStatus: 'approved', status: 'queued' } });
      await this.audit.record({ agentId: execution.agentId, executionId: execution.id, action: `ai.agent.approval_${dto.status}`, riskLevel: execution.riskLevel, metadata: { approvalId: approval.id, reason: dto.decisionReason } });
    }
    return updated;
  }

  async assertExecutable(execution: any) {
    if (execution.riskLevel === 'low') return;
    if (execution.approvalStatus === 'approved') return;
    if (await this.isFullyApproved(execution.id)) return;
    throw new ForbiddenException('Agent execution requires approval before execution');
  }

  async isFullyApproved(executionId: string) {
    const approvals = await this.prisma.aiAgentApproval.findMany({ where: { tenantId: this.tenantId(), executionId, deletedAt: null } });
    return approvals.length > 0 && approvals.every((approval: any) => approval.status === 'approved');
  }

  list(executionId?: string) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    if (executionId) where.executionId = executionId;
    return this.prisma.aiAgentApproval.findMany({ where, orderBy: { requestedAt: 'desc' }, take: 200 });
  }
}