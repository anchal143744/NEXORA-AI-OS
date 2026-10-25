import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateEmergencyControlDto, CreateIncidentDto, SuspendTenantDto } from '../dto/enterprise-admin.dto';
import { SecurityOperationsService } from './security-operations.service';

@ApiTags('Security Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'security-operations', version: '1' })
export class SecurityOperationsController {
  constructor(private readonly security: SecurityOperationsService) {}
  @Get('tenant-suspensions') tenantSuspensions() { return this.security.tenantSuspensions(); }
  @Post('tenant-suspensions') suspendTenant(@Body() dto: SuspendTenantDto) { return this.security.suspendTenant(dto); }
  @Post('tenant-suspensions/:id/restore') restoreTenant(@Param('id') id: string) { return this.security.restoreTenant(id); }
  @Get('emergency-controls') emergencyControls() { return this.security.emergencyControls(); }
  @Post('emergency-controls') activateEmergencyControl(@Body() dto: CreateEmergencyControlDto) { return this.security.activateEmergencyControl(dto); }
  @Post('emergency-controls/:controlKey/deactivate') deactivateEmergencyControl(@Param('controlKey') controlKey: string) { return this.security.deactivateEmergencyControl(controlKey); }
  @Get('global-permissions') globalPermissions() { return this.security.globalPermissions(); }
  @Get('incidents') incidents(@Query('status') status?: string) { return this.security.incidents(status); }
  @Post('incidents') createIncident(@Body() dto: CreateIncidentDto) { return this.security.createIncident(dto); }
  @Post('incidents/:id/resolve') resolveIncident(@Param('id') id: string) { return this.security.resolveIncident(id); }
}
