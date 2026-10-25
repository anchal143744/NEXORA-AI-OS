import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateFieldServiceSlaPolicyDto, CreateFieldServiceSlaCommitmentDto, CreateFieldServiceSlaBreachDto, CreateFieldServiceEscalationDto } from '../dto/field-service.dto';
import { FieldServiceAnalyticsService } from '../field-service-analytics.service';
import { FieldServiceCommandService } from '../field-service-command.service';
import { FieldServiceQueryService } from '../field-service-query.service';

@ApiTags('SLA Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'field-sla-management', version: '1' })
export class FieldSlaManagementController {
  constructor(private readonly commands: FieldServiceCommandService, private readonly queries: FieldServiceQueryService, private readonly analytics: FieldServiceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('SLA Management');
  }

  @Get('sla-policies') listFieldServiceSlaPolicy(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceSlaPolicy', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('sla-policies') createFieldServiceSlaPolicy(@Body() dto: CreateFieldServiceSlaPolicyDto) {
    return this.commands.create('fieldServiceSlaPolicy', dto);
  }

  @Get('sla-commitments') listFieldServiceSlaCommitment(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceSlaCommitment', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('sla-commitments') createFieldServiceSlaCommitment(@Body() dto: CreateFieldServiceSlaCommitmentDto) {
    return this.commands.create('fieldServiceSlaCommitment', dto);
  }

  @Get('sla-breaches') listFieldServiceSlaBreach(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceSlaBreach', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('sla-breaches') createFieldServiceSlaBreach(@Body() dto: CreateFieldServiceSlaBreachDto) {
    return this.commands.create('fieldServiceSlaBreach', dto);
  }

  @Get('escalations') listFieldServiceEscalation(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceEscalation', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('escalations') createFieldServiceEscalation(@Body() dto: CreateFieldServiceEscalationDto) {
    return this.commands.create('fieldServiceEscalation', dto);
  }
}

