import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAssetWorkOrderDto, CreateWorkOrderTaskDto, CreateWorkOrderPartDto, CreateWorkOrderTimeEntryDto, CreateWorkOrderApprovalDto } from '../dto/eam.dto';
import { EamAnalyticsService } from '../eam-analytics.service';
import { EamCommandService } from '../eam-command.service';
import { EamQueryService } from '../eam-query.service';

@ApiTags('Work Order Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'work-orders', version: '1' })
export class WorkOrdersController {
  constructor(private readonly commands: EamCommandService, private readonly queries: EamQueryService, private readonly analytics: EamAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Work Order Management');
  }

  @Get('work-orders') listAssetWorkOrder(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetWorkOrder', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('work-orders') createAssetWorkOrder(@Body() dto: CreateAssetWorkOrderDto) {
    return this.commands.create('assetWorkOrder', dto);
  }

  @Get('work-order-tasks') listWorkOrderTask(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('workOrderTask', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('work-order-tasks') createWorkOrderTask(@Body() dto: CreateWorkOrderTaskDto) {
    return this.commands.create('workOrderTask', dto);
  }

  @Get('work-order-parts') listWorkOrderPart(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('workOrderPart', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('work-order-parts') createWorkOrderPart(@Body() dto: CreateWorkOrderPartDto) {
    return this.commands.create('workOrderPart', dto);
  }

  @Get('work-order-time-entries') listWorkOrderTimeEntry(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('workOrderTimeEntry', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('work-order-time-entries') createWorkOrderTimeEntry(@Body() dto: CreateWorkOrderTimeEntryDto) {
    return this.commands.create('workOrderTimeEntry', dto);
  }

  @Get('work-order-approvals') listWorkOrderApproval(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('workOrderApproval', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('work-order-approvals') createWorkOrderApproval(@Body() dto: CreateWorkOrderApprovalDto) {
    return this.commands.create('workOrderApproval', dto);
  }
}

