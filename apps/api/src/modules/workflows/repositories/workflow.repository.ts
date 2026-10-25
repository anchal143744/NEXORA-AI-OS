import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
@Injectable()
export class WorkflowRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(input: { tenantId: string; workspaceId?: string; name: string; slug: string; triggerDefinition: Record<string, unknown>; graphDefinition: Record<string, unknown>; version?: number; status?: string }) { return this.prisma.workflow.create({ data: { tenantId: input.tenantId, workspaceId: input.workspaceId, name: input.name, slug: input.slug, triggerDefinition: input.triggerDefinition, graphDefinition: input.graphDefinition, version: input.version ?? 1, status: input.status ?? 'DRAFT' } }); }
  list(tenantId: string, workspaceId?: string) { return this.prisma.workflow.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: [{ slug: 'asc' }, { version: 'desc' }] }); }
  async findById(tenantId: string, id: string) { const workflow = await this.prisma.workflow.findFirst({ where: { tenantId, id, deletedAt: null } }); if (!workflow) throw new NotFoundException('Workflow not found'); return workflow; }
  findLatestBySlug(tenantId: string, slug: string) { return this.prisma.workflow.findFirst({ where: { tenantId, slug, deletedAt: null }, orderBy: { version: 'desc' } }); }
  async findActiveByTrigger(tenantId: string, workspaceId: string | undefined, triggerType: string) { const rows = await this.prisma.workflow.findMany({ where: { tenantId, status: 'ACTIVE', deletedAt: null, OR: [{ workspaceId }, { workspaceId: null }] } }); return rows.filter((row: any) => row.triggerDefinition?.type === triggerType); }
  update(tenantId: string, id: string, data: Record<string, unknown>) { return this.prisma.workflow.update({ where: { id }, data }); }
  createExecution(input: { tenantId: string; workspaceId?: string; workflowId: string; input: Record<string, unknown> }) { return this.prisma.workflowExecution.create({ data: { tenantId: input.tenantId, workspaceId: input.workspaceId, workflowId: input.workflowId, input: input.input, status: 'QUEUED' } }); }
  updateExecution(id: string, data: Record<string, unknown>) { return this.prisma.workflowExecution.update({ where: { id }, data }); }
  createStep(input: { tenantId: string; executionId: string; stepKey: string; stepType: string; input: Record<string, unknown> }) { return this.prisma.workflowStepExecution.create({ data: { tenantId: input.tenantId, workflowExecutionId: input.executionId, stepKey: input.stepKey, stepType: input.stepType, input: input.input, status: 'RUNNING', startedAt: new Date() } }); }
  updateStep(id: string, data: Record<string, unknown>) { return this.prisma.workflowStepExecution.update({ where: { id }, data }); }
}
