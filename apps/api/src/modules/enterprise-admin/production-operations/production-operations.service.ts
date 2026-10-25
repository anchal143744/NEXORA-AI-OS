import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { RecordHealthSnapshotDto } from '../dto/enterprise-admin.dto';

@Injectable()
export class ProductionOperationsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  async systemHealth() {
    const tenantId = this.context.currentTenantId();
    const latest = await this.prisma.systemHealthSnapshot.findMany({ where: { tenantId, deletedAt: null }, orderBy: { observedAt: 'desc' }, take: 50 });
    const status = latest.some((item: any) => item.status === 'critical') ? 'critical' : latest.some((item: any) => item.status === 'degraded') ? 'degraded' : 'healthy';
    return { status, latest };
  }

  async apiHealth() {
    const tenantId = this.context.currentTenantId();
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const [latency, throughput, errors] = await Promise.all([
      this.prisma.operationalMetric.findMany({ where: { tenantId, name: 'api.latency', createdAt: { gte: since } }, orderBy: { createdAt: 'desc' }, take: 100 }),
      this.prisma.operationalMetric.findMany({ where: { tenantId, name: 'api.throughput', createdAt: { gte: since } }, orderBy: { createdAt: 'desc' }, take: 100 }),
      this.prisma.operationalMetric.count({ where: { tenantId, name: 'api.error', createdAt: { gte: since } } }),
    ]);
    return { window: '1h', latency, throughput, errors };
  }

  async queueHealth() {
    const tenantId = this.context.currentTenantId();
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const metrics = await this.prisma.operationalMetric.findMany({ where: { tenantId, name: { in: ['queue.size', 'queue.latency', 'queue.failure'] }, createdAt: { gte: since } }, orderBy: { createdAt: 'desc' }, take: 100 });
    return { window: '1h', metrics };
  }

  async workflowHealth() {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    const [running, queued, failed, approvals] = await Promise.all([
      this.prisma.workflowExecution.count({ where: { tenantId, workspaceId, status: 'RUNNING' } }),
      this.prisma.workflowExecution.count({ where: { tenantId, workspaceId, status: 'QUEUED' } }),
      this.prisma.workflowExecution.count({ where: { tenantId, workspaceId, status: 'FAILED' } }),
      this.prisma.workflowApproval.count({ where: { tenantId, workspaceId, status: 'pending', deletedAt: null } }),
    ]);
    return { running, queued, failed, pendingApprovals: approvals };
  }

  async aiRuntimeHealth() {
    const tenantId = this.context.currentTenantId();
    const [toolCalls, conversations, promptLogs, actionLogs, snapshots] = await Promise.all([
      this.prisma.aiToolCall.count({ where: { tenantId } }),
      this.prisma.aiConversation.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.aiPromptLog.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.aiActionLog.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.aiUsageSnapshot.findMany({ where: { tenantId, deletedAt: null }, orderBy: { periodStart: 'desc' }, take: 12 }),
    ]);
    return { toolCalls, conversations, promptLogs, actionLogs, usageSnapshots: snapshots };
  }

  recordSnapshot(dto: RecordHealthSnapshotDto) {
    return this.prisma.systemHealthSnapshot.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), component: dto.component, status: dto.status, latencyMs: dto.latencyMs, details: dto.details ?? {} } });
  }
}
