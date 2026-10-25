import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RequestContextStore } from '../../common/context/request-context.store';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class TenantContextService {
  constructor(private readonly contextStore: RequestContextStore, private readonly prisma: PrismaService) {}

  context() {
    return this.contextStore.get();
  }

  currentTenantId() {
    const tenantId = this.contextStore.get()?.tenantId;
    if (!tenantId) throw new BadRequestException('Tenant context is required');
    return tenantId;
  }

  currentWorkspaceId() {
    return this.contextStore.get()?.workspaceId;
  }

  async validateTenant(tenantId = this.currentTenantId()) {
    const tenant = await this.prisma.tenant.findFirst({ where: { id: tenantId, deletedAt: null } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }
}
