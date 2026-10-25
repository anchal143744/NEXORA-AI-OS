import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { TenantRepository } from '../../tenants/repositories/tenant.repository';

@Injectable()
export class WorkspaceResolver {
  constructor(private readonly tenantContext: TenantContextService, private readonly tenantRepository: TenantRepository) {}

  async currentWorkspace() {
    const tenantId = this.tenantContext.currentTenantId();
    const workspaceId = this.tenantContext.currentWorkspaceId();
    if (!workspaceId) throw new BadRequestException('Workspace context is required');
    const workspace = await this.tenantRepository.getWorkspace(tenantId, workspaceId);
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }
}
