import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateAgentTaskDto, CreateAgentWorkflowDto } from '../dto/agent-execution.dto';

@Injectable()
export class AgentTaskWorkflowService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId() { return this.context.currentWorkspaceId(); }

  createTask(dto: CreateAgentTaskDto) {
    return this.prisma.aiAgentTask.create({ data: { tenantId: this.tenantId(), workspaceId: this.workspaceId(), executionId: dto.executionId, taskType: dto.taskType, title: dto.title, description: dto.description, assignedToUserId: dto.assignedToUserId, payload: dto.payload ?? {} } });
  }

  listTasks(status?: string) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    const workspaceId = this.workspaceId();
    if (workspaceId) where.workspaceId = workspaceId;
    if (status) where.status = status;
    return this.prisma.aiAgentTask.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200 });
  }

  createWorkflow(dto: CreateAgentWorkflowDto) {
    return this.prisma.aiAgentWorkflow.create({ data: { tenantId: this.tenantId(), workspaceId: this.workspaceId(), executionId: dto.executionId, workflowKey: dto.workflowKey, title: dto.title, trigger: dto.trigger ?? {}, steps: dto.steps ?? [], rollbackPlan: dto.rollbackPlan ?? {} } });
  }

  listWorkflows(status?: string) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    const workspaceId = this.workspaceId();
    if (workspaceId) where.workspaceId = workspaceId;
    if (status) where.status = status;
    return this.prisma.aiAgentWorkflow.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200 });
  }
}