import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCustomerServiceVisitDto, CreateCustomerServiceFeedbackDto, CreateCustomerServiceResolutionDto, CreateCustomerServiceInsightDto } from '../dto/field-service.dto';
import { FieldServiceAnalyticsService } from '../field-service-analytics.service';
import { FieldServiceCommandService } from '../field-service-command.service';
import { FieldServiceQueryService } from '../field-service-query.service';

@ApiTags('Customer Service Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'customer-service-intelligence', version: '1' })
export class CustomerServiceIntelligenceController {
  constructor(private readonly commands: FieldServiceCommandService, private readonly queries: FieldServiceQueryService, private readonly analytics: FieldServiceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Customer Service Intelligence');
  }

  @Get('service-visits') listCustomerServiceVisit(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('customerServiceVisit', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('service-visits') createCustomerServiceVisit(@Body() dto: CreateCustomerServiceVisitDto) {
    return this.commands.create('customerServiceVisit', dto);
  }

  @Get('service-feedback') listCustomerServiceFeedback(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('customerServiceFeedback', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('service-feedback') createCustomerServiceFeedback(@Body() dto: CreateCustomerServiceFeedbackDto) {
    return this.commands.create('customerServiceFeedback', dto);
  }

  @Get('service-resolutions') listCustomerServiceResolution(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('customerServiceResolution', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('service-resolutions') createCustomerServiceResolution(@Body() dto: CreateCustomerServiceResolutionDto) {
    return this.commands.create('customerServiceResolution', dto);
  }

  @Get('service-insights') listCustomerServiceInsight(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('customerServiceInsight', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('service-insights') createCustomerServiceInsight(@Body() dto: CreateCustomerServiceInsightDto) {
    return this.commands.create('customerServiceInsight', dto);
  }
}

