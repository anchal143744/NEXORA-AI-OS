import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessAuditService } from '../audit/business-audit.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { ModuleActivationDto } from './dto/module-activation.dto';
import { ModuleMetadataService } from './module-metadata.service';

@Injectable()
export class ModuleActivationService {
  constructor(private readonly prisma: PrismaService, private readonly tenantContext: TenantContextService, private readonly metadata: ModuleMetadataService, private readonly audit: BusinessAuditService) {}

  async setActivation(dto: ModuleActivationDto) {
    const tenantId = this.tenantContext.currentTenantId();
    const module = this.metadata.find(dto.moduleKey);
    if (!module) throw new BadRequestException('Unknown module key');
    const enabled = dto.enabled ?? true;
    const activation = await this.prisma.moduleActivation.upsert({
      where: { tenantId_businessId_moduleKey: { tenantId, businessId: dto.businessId, moduleKey: dto.moduleKey } },
      update: { enabled, workspaceId: dto.workspaceId, disabledAt: enabled ? null : new Date() },
      create: { tenantId, businessId: dto.businessId, workspaceId: dto.workspaceId, moduleKey: dto.moduleKey, enabled, disabledAt: enabled ? null : new Date() },
    });
    await this.audit.record({ tenantId, userId: this.tenantContext.context()?.userId, action: enabled ? 'CREATE' : 'UPDATE', resourceType: 'module.activation', resourceId: activation.id, message: `${module.name} module ${enabled ? 'enabled' : 'disabled'}` });
    return activation;
  }

  listForBusiness(businessId: string) {
    return this.prisma.moduleActivation.findMany({ where: { tenantId: this.tenantContext.currentTenantId(), businessId, deletedAt: null } });
  }
}
