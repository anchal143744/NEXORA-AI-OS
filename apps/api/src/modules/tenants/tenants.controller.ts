import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { CreateBusinessDto } from './dto/create-business.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { TenantsService } from './tenants.service';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller({ path: 'tenants', version: '1' })
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @RequirePermissions('create')
  @Post('organizations')
  @ApiOperation({ summary: 'Create organization in current tenant' })
  createOrganization(@Body() dto: CreateOrganizationDto) {
    return this.tenantsService.createOrganization(dto);
  }

  @RequirePermissions('create')
  @Post('businesses')
  @ApiOperation({ summary: 'Create business in current tenant' })
  createBusiness(@Body() dto: CreateBusinessDto) {
    return this.tenantsService.createBusiness(dto);
  }
}
