import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateFieldServiceRegionDto, CreateFieldServiceTerritoryDto, CreateFieldServiceRequestDto, CreateFieldServiceCaseDto, CreateFieldServiceAppointmentDto } from '../dto/field-service.dto';
import { FieldServiceAnalyticsService } from '../field-service-analytics.service';
import { FieldServiceCommandService } from '../field-service-command.service';
import { FieldServiceQueryService } from '../field-service-query.service';

@ApiTags('Field Service Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'field-service-management', version: '1' })
export class FieldServiceManagementController {
  constructor(private readonly commands: FieldServiceCommandService, private readonly queries: FieldServiceQueryService, private readonly analytics: FieldServiceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Field Service Management');
  }

  @Get('regions') listFieldServiceRegion(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceRegion', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('regions') createFieldServiceRegion(@Body() dto: CreateFieldServiceRegionDto) {
    return this.commands.create('fieldServiceRegion', dto);
  }

  @Get('territories') listFieldServiceTerritory(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceTerritory', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('territories') createFieldServiceTerritory(@Body() dto: CreateFieldServiceTerritoryDto) {
    return this.commands.create('fieldServiceTerritory', dto);
  }

  @Get('requests') listFieldServiceRequest(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceRequest', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('requests') createFieldServiceRequest(@Body() dto: CreateFieldServiceRequestDto) {
    return this.commands.create('fieldServiceRequest', dto);
  }

  @Get('cases') listFieldServiceCase(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceCase', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('cases') createFieldServiceCase(@Body() dto: CreateFieldServiceCaseDto) {
    return this.commands.create('fieldServiceCase', dto);
  }

  @Get('appointments') listFieldServiceAppointment(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceAppointment', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('appointments') createFieldServiceAppointment(@Body() dto: CreateFieldServiceAppointmentDto) {
    return this.commands.create('fieldServiceAppointment', dto);
  }
}

