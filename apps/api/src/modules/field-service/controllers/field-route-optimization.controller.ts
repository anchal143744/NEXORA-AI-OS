import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateFieldRoutePlanDto, CreateFieldRouteStopDto, CreateFieldRouteOptimizationDto, CreateTravelTimeEstimateDto } from '../dto/field-service.dto';
import { FieldServiceAnalyticsService } from '../field-service-analytics.service';
import { FieldServiceCommandService } from '../field-service-command.service';
import { FieldServiceQueryService } from '../field-service-query.service';

@ApiTags('Route Optimization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'field-route-optimization', version: '1' })
export class FieldRouteOptimizationController {
  constructor(private readonly commands: FieldServiceCommandService, private readonly queries: FieldServiceQueryService, private readonly analytics: FieldServiceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Route Optimization');
  }

  @Get('route-plans') listFieldRoutePlan(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldRoutePlan', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('route-plans') createFieldRoutePlan(@Body() dto: CreateFieldRoutePlanDto) {
    return this.commands.create('fieldRoutePlan', dto);
  }

  @Get('route-stops') listFieldRouteStop(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldRouteStop', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('route-stops') createFieldRouteStop(@Body() dto: CreateFieldRouteStopDto) {
    return this.commands.create('fieldRouteStop', dto);
  }

  @Get('route-optimizations') listFieldRouteOptimization(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldRouteOptimization', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('route-optimizations') createFieldRouteOptimization(@Body() dto: CreateFieldRouteOptimizationDto) {
    return this.commands.create('fieldRouteOptimization', dto);
  }

  @Get('travel-time-estimates') listTravelTimeEstimate(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('travelTimeEstimate', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('travel-time-estimates') createTravelTimeEstimate(@Body() dto: CreateTravelTimeEstimateDto) {
    return this.commands.create('travelTimeEstimate', dto);
  }
}

