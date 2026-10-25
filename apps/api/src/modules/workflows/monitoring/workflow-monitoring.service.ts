import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../events/event-bus.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { RecordWorkflowMetricDto } from '../dto/workflow-builder.dto';

@Injectable()
export class WorkflowMonitoringService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  async summary() {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    const [total, succeeded, failed, running, pendingApprovals, latency, failedActions, aiDecisions] = await Promise.all([
      this.prisma.workflowExecution.count({ where: { tenantId, workspaceId } }),
      this.prisma.workflowExecution.count({ where: { tenantId, workspaceId, status: 'SUCCEEDED' } }),
      this.prisma.workflowExecution.count({ where: { tenantId, workspaceId, status: 'FAILED' } }),
      this.prisma.workflowExecution.count({ where: { tenantId, workspaceId, status: 'RUNNING' } }),
      this.prisma.workflowApproval.count({ where: { tenantId, workspaceId, status: 'pending', deletedAt: null } }),
      this.prisma.workflowExecution.aggregate({ where: { tenantId, workspaceId, latencyMs: { not: null } }, _avg: { latencyMs: true } }),
      this.prisma.workflowStepExecution.count({ where: { tenantId, status: 'FAILED' } }),
      this.prisma.workflowMetric.findMany({ where: { tenantId, workspaceId, metricKey: { in: ['ai_decision_count', 'ai_decision_confidence'] }, deletedAt: null }, orderBy: { observedAt: 'desc' }, take: 25 }),
    ]);
    const successRate = total === 0 ? 0 : Number(((succeeded / total) * 100).toFixed(2));
    return { totalExecutions: total, runningExecutions: running, successRate, averageLatencyMs: Math.round(Number(latency._avg.latencyMs ?? 0)), failedActions, pendingApprovals, automationSavingsHours: Number((succeeded * 0.42).toFixed(2)), aiDecisionMetrics: aiDecisions, failedExecutions: failed };
  }

  async record(dto: RecordWorkflowMetricDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    const metric = await this.prisma.workflowMetric.create({ data: { tenantId, workspaceId, workflowId: dto.workflowId, workflowExecutionId: dto.workflowExecutionId, metricKey: dto.metricKey, metricValue: dto.metricValue, unit: dto.unit, dimensions: dto.dimensions ?? {} } });
    await this.prisma.workflowAudit.create({ data: { tenantId, workspaceId, workflowId: dto.workflowId, workflowExecutionId: dto.workflowExecutionId, actorUserId: this.context.context()?.userId, action: 'workflow.metric.recorded', resourceType: 'workflow_metric', resourceId: metric.id, after: metric as object } });
    await this.events.publish({ tenantId, workspaceId, type: 'workflow.metric.recorded', source: 'workflow-monitoring', subject: { type: 'workflow_metric', id: metric.id }, payload: { metricKey: dto.metricKey, metricValue: dto.metricValue, workflowId: dto.workflowId }, actorUserId: this.context.context()?.userId });
    return metric;
  }
}
