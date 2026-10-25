import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EventBusService } from '../../events/event-bus.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { WorkflowExecutionJob } from '../contracts/workflow-definition.contract';

@Injectable()
export class WorkflowExecutionConsoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly context: TenantContextService,
    private readonly events: EventBusService,
    @InjectQueue(QUEUES.WORKFLOW_EXECUTION) private readonly executionQueue: Queue<WorkflowExecutionJob>,
  ) {}

  list(status?: string) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    return this.prisma.workflowExecution.findMany({ where: { tenantId, workspaceId, status: status ?? undefined }, include: { workflow: true, steps: true, approvals: true }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  running() { return this.list('RUNNING'); }
  queued() { return this.list('QUEUED'); }
  failed() { return this.list('FAILED'); }

  retryQueue() {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    return this.prisma.workflowExecution.findMany({ where: { tenantId, workspaceId, status: 'FAILED' }, include: { workflow: true }, orderBy: { updatedAt: 'desc' }, take: 50 });
  }

  approvalQueue() {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    return this.prisma.workflowApproval.findMany({ where: { tenantId, workspaceId, status: 'pending', deletedAt: null }, include: { workflow: true, execution: true, approver: true }, orderBy: { requestedAt: 'asc' }, take: 100 });
  }

  aiTracking() {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    return this.prisma.workflowExecution.findMany({ where: { tenantId, workspaceId }, select: { id: true, workflowId: true, status: true, aiDecisionTrace: true, metrics: true, startedAt: true, finishedAt: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async retryExecution(id: string) {
    const tenantId = this.context.currentTenantId();
    const execution = await this.prisma.workflowExecution.findFirst({ where: { tenantId, id }, include: { workflow: true } });
    if (!execution) throw new NotFoundException('Workflow execution not found');
    const updated = await this.prisma.workflowExecution.update({ where: { id }, data: { status: 'QUEUED', approvalStatus: 'not_required', retryCount: { increment: 1 }, error: undefined, startedAt: undefined, finishedAt: undefined } });
    await this.executionQueue.add('workflow-execution-retry', { tenantId, workspaceId: execution.workspaceId ?? undefined, workflowId: execution.workflowId, executionId: execution.id, input: execution.input as Record<string, unknown> });
    await this.prisma.workflowAudit.create({ data: { tenantId, workspaceId: execution.workspaceId, workflowId: execution.workflowId, workflowExecutionId: execution.id, actorUserId: this.context.context()?.userId, action: 'workflow.execution.retried', resourceType: 'workflow_execution', resourceId: execution.id, before: execution as object, after: updated as object } });
    await this.events.publish({ tenantId, workspaceId: execution.workspaceId ?? undefined, type: 'workflow.execution.retried', source: 'workflow-execution-console', subject: { type: 'workflow_execution', id: execution.id }, payload: { workflowId: execution.workflowId, retryCount: updated.retryCount }, actorUserId: this.context.context()?.userId });
    return updated;
  }
}
