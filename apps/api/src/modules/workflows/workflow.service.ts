import { Injectable } from '@nestjs/common';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';
import { WorkflowRepository } from './repositories/workflow.repository';
import { WorkflowValidationService } from './workflow-validation.service';
@Injectable()
export class WorkflowService {
  constructor(private readonly repo: WorkflowRepository, private readonly context: TenantContextService, private readonly validator: WorkflowValidationService) {}
  create(dto: CreateWorkflowDto) { const tenantId = this.context.currentTenantId(); const workspaceId = this.context.currentWorkspaceId(); const triggerDefinition = { type: dto.triggerType, config: dto.triggerConfig ?? {} }; this.validator.validateTrigger(triggerDefinition); const graphDefinition = this.validator.validateGraph(dto.graphDefinition) as unknown as Record<string, unknown>; return this.repo.create({ tenantId, workspaceId, name: dto.name, slug: dto.slug, triggerDefinition, graphDefinition }); }
  list() { return this.repo.list(this.context.currentTenantId(), this.context.currentWorkspaceId()); }
  async update(id: string, dto: UpdateWorkflowDto) { const tenantId = this.context.currentTenantId(); const data: Record<string, unknown> = {}; if (dto.name) data.name = dto.name; if (dto.triggerConfig) data.triggerDefinition = { ...(await this.repo.findById(tenantId, id)).triggerDefinition, config: dto.triggerConfig }; if (dto.graphDefinition) data.graphDefinition = this.validator.validateGraph(dto.graphDefinition) as unknown as Record<string, unknown>; return this.repo.update(tenantId, id, data); }
}

