import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAssetMaintenancePlanDto, CreateAssetMaintenanceScheduleDto, CreateAssetMaintenanceTaskDto, CreateAssetInspectionDto } from '../dto/eam.dto';
import { EamAnalyticsService } from '../eam-analytics.service';
import { EamCommandService } from '../eam-command.service';
import { EamQueryService } from '../eam-query.service';

@ApiTags('Maintenance Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'maintenance-management', version: '1' })
export class MaintenanceManagementController {
  constructor(private readonly commands: EamCommandService, private readonly queries: EamQueryService, private readonly analytics: EamAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Maintenance Management');
  }

  @Get('maintenance-plans') listAssetMaintenancePlan(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetMaintenancePlan', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('maintenance-plans') createAssetMaintenancePlan(@Body() dto: CreateAssetMaintenancePlanDto) {
    return this.commands.create('assetMaintenancePlan', dto);
  }

  @Get('maintenance-schedules') listAssetMaintenanceSchedule(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetMaintenanceSchedule', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('maintenance-schedules') createAssetMaintenanceSchedule(@Body() dto: CreateAssetMaintenanceScheduleDto) {
    return this.commands.create('assetMaintenanceSchedule', dto);
  }

  @Get('maintenance-tasks') listAssetMaintenanceTask(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetMaintenanceTask', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('maintenance-tasks') createAssetMaintenanceTask(@Body() dto: CreateAssetMaintenanceTaskDto) {
    return this.commands.create('assetMaintenanceTask', dto);
  }

  @Get('inspections') listAssetInspection(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetInspection', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('inspections') createAssetInspection(@Body() dto: CreateAssetInspectionDto) {
    return this.commands.create('assetInspection', dto);
  }
}

