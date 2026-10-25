import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateFieldWorkOrderDto, CreateFieldWorkOrderTaskDto, CreateFieldWorkOrderPartDto, CreateFieldWorkOrderChecklistDto, CreateFieldWorkOrderCompletionDto } from '../dto/field-service.dto';
import { FieldServiceAnalyticsService } from '../field-service-analytics.service';
import { FieldServiceCommandService } from '../field-service-command.service';
import { FieldServiceQueryService } from '../field-service-query.service';

@ApiTags('Work Order Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'field-work-orders', version: '1' })
export class FieldWorkOrdersController {
  constructor(private readonly commands: FieldServiceCommandService, private readonly queries: FieldServiceQueryService, private readonly analytics: FieldServiceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Work Order Management');
  }

  @Get('work-orders') listFieldWorkOrder(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldWorkOrder', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('work-orders') createFieldWorkOrder(@Body() dto: CreateFieldWorkOrderDto) {
    return this.commands.create('fieldWorkOrder', dto);
  }

  @Get('work-order-tasks') listFieldWorkOrderTask(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldWorkOrderTask', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('work-order-tasks') createFieldWorkOrderTask(@Body() dto: CreateFieldWorkOrderTaskDto) {
    return this.commands.create('fieldWorkOrderTask', dto);
  }

  @Get('work-order-parts') listFieldWorkOrderPart(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldWorkOrderPart', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('work-order-parts') createFieldWorkOrderPart(@Body() dto: CreateFieldWorkOrderPartDto) {
    return this.commands.create('fieldWorkOrderPart', dto);
  }

  @Get('work-order-checklists') listFieldWorkOrderChecklist(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldWorkOrderChecklist', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('work-order-checklists') createFieldWorkOrderChecklist(@Body() dto: CreateFieldWorkOrderChecklistDto) {
    return this.commands.create('fieldWorkOrderChecklist', dto);
  }

  @Get('work-order-completions') listFieldWorkOrderCompletion(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldWorkOrderCompletion', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('work-order-completions') createFieldWorkOrderCompletion(@Body() dto: CreateFieldWorkOrderCompletionDto) {
    return this.commands.create('fieldWorkOrderCompletion', dto);
  }
}

