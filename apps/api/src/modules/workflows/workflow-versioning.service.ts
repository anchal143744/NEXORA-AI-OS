import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantContextService } from '../tenants/tenant-context.service';
import { WorkflowRepository } from './repositories/workflow.repository';
import { WorkflowValidationService } from './workflow-validation.service';
@Injectable()
export class WorkflowVersioningService {
  constructor(private readonly repo: WorkflowRepository, private readonly context: TenantContextService, private readonly validator: WorkflowValidationService) {}
  async publish(id: string) { const workflow = await this.repo.findById(this.context.currentTenantId(), id); this.validator.validateGraph(workflow.graphDefinition); return this.repo.update(workflow.tenantId, id, { status: 'ACTIVE' }); }
  async createDraftVersion(id: string) { const workflow = await this.repo.findById(this.context.currentTenantId(), id); const latest = await this.repo.findLatestBySlug(workflow.tenantId, workflow.slug); return this.repo.create({ tenantId: workflow.tenantId, workspaceId: workflow.workspaceId ?? undefined, name: workflow.name, slug: workflow.slug, triggerDefinition: workflow.triggerDefinition, graphDefinition: workflow.graphDefinition, version: ((latest as any)?.version ?? workflow.version) + 1, status: 'DRAFT' }); }
  async rollback(id: string, version: number) { const workflow = await this.repo.findById(this.context.currentTenantId(), id); const all = await this.repo.list(workflow.tenantId, workflow.workspaceId ?? undefined); const selected = all.find((row: any) => row.slug === workflow.slug && row.version === version); if (!selected) throw new NotFoundException('Workflow version not found'); const latest = await this.repo.findLatestBySlug(workflow.tenantId, workflow.slug); return this.repo.create({ tenantId: workflow.tenantId, workspaceId: workflow.workspaceId ?? undefined, name: selected.name, slug: selected.slug, triggerDefinition: selected.triggerDefinition, graphDefinition: selected.graphDefinition, version: ((latest as any)?.version ?? workflow.version) + 1, status: 'DRAFT' }); }
}
