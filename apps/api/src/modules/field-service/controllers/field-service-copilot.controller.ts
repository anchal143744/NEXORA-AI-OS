import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateFieldServiceCopilotQueryDto, CreateFieldServiceRecommendationDto, CreateFieldServiceRiskSignalDto } from '../dto/field-service.dto';
import { FieldServiceAnalyticsService } from '../field-service-analytics.service';
import { FieldServiceCommandService } from '../field-service-command.service';
import { FieldServiceQueryService } from '../field-service-query.service';

@ApiTags('AI Field Service Copilot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'field-service-copilot', version: '1' })
export class FieldServiceCopilotController {
  constructor(private readonly commands: FieldServiceCommandService, private readonly queries: FieldServiceQueryService, private readonly analytics: FieldServiceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('AI Field Service Copilot');
  }

  @Get('queries') listFieldServiceCopilotQuery(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceCopilotQuery', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('queries') createFieldServiceCopilotQuery(@Body() dto: CreateFieldServiceCopilotQueryDto) {
    return this.commands.create('fieldServiceCopilotQuery', dto);
  }

  @Get('recommendations') listFieldServiceRecommendation(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceRecommendation', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('recommendations') createFieldServiceRecommendation(@Body() dto: CreateFieldServiceRecommendationDto) {
    return this.commands.create('fieldServiceRecommendation', dto);
  }

  @Get('risk-signals') listFieldServiceRiskSignal(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('fieldServiceRiskSignal', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('risk-signals') createFieldServiceRiskSignal(@Body() dto: CreateFieldServiceRiskSignalDto) {
    return this.commands.create('fieldServiceRiskSignal', dto);
  }
}

