import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { WorkspaceBlueprintService } from '../adaptive-workspace/blueprints/workspace-blueprint.service';
import { GenerateWorkspaceDto } from '../adaptive-workspace/dto/adaptive-workspace.dto';
import { TenantContextService } from '../tenants/tenant-context.service';
import { TenantRepository } from '../tenants/repositories/tenant.repository';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceResolver } from './resolvers/workspace.resolver';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly repository: TenantRepository,
    private readonly resolver: WorkspaceResolver,
    private readonly blueprints: WorkspaceBlueprintService,
  ) {}

  async create(dto: CreateWorkspaceDto) {
    const tenantId = this.tenantContext.currentTenantId();
    const workspace = await this.repository.createWorkspace(tenantId, dto);
    const userId = this.tenantContext.context()?.userId;
    if (userId) {
      await this.repository.ensureOrganizationMembership(tenantId, dto.organizationId, userId);
      await this.repository.ensureWorkspaceMembership(tenantId, workspace.id, userId);
    }
    return workspace;
  }

  generate(dto: GenerateWorkspaceDto) {
    const context = this.tenantContext.context();
    const organizationId = context?.organizationId ?? dto.organizationId;
    const workspaceId = context?.workspaceId;
    if (!organizationId) throw new BadRequestException('Organization context is required before workspace generation');
    if (!workspaceId) throw new BadRequestException('Workspace context is required before workspace generation');
    return this.blueprints.generate({ ...dto, organizationId }, workspaceId);
  }

  current() {
    return this.resolver.currentWorkspace();
  }

  async update(workspaceId: string, dto: UpdateWorkspaceDto) {
    const tenantId = this.tenantContext.currentTenantId();
    const result = await this.repository.updateWorkspace(tenantId, workspaceId, dto);
    if (!result.count) throw new NotFoundException('Workspace not found');
    return this.repository.getWorkspace(tenantId, workspaceId);
  }
}
