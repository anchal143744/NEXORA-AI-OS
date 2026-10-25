import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { TenantContextService } from './tenant-context.service';
import { TenantRepository } from './repositories/tenant.repository';

@Injectable()
export class TenantsService {
  constructor(private readonly tenantContext: TenantContextService, private readonly repository: TenantRepository) {}

  async createOrganization(dto: CreateOrganizationDto) {
    const tenantId = this.tenantContext.currentTenantId();
    await this.tenantContext.validateTenant(tenantId);
    return this.repository.createOrganization(tenantId, dto);
  }

  async createBusiness(dto: CreateBusinessDto) {
    const tenantId = this.tenantContext.currentTenantId();
    await this.tenantContext.validateTenant(tenantId);
    return this.repository.createBusiness(tenantId, dto);
  }
}
