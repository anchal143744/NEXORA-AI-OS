import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiCustomerSuccessService } from '../ai-customer-success.service';
import { ServiceAutomationService } from '../service-automation.service';

@ApiTags('Service Center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'service-center', version: '1' })
export class ServiceCenterController {
  constructor(private readonly service: ServiceAutomationService, private readonly ai: AiCustomerSuccessService) {}

  @Get('dashboard') dashboard() { return this.service.serviceAnalytics(); }
  @Get('analytics') analytics() { return this.service.serviceAnalytics(); }
  @Get('workflows') workflows() { return this.service.serviceWorkflows(); }
  @Get('escalations') escalations(@Query('ticketId') ticketId?: string) { return this.service.escalations(ticketId); }
  @Get('copilot/optimization') optimization() { return this.ai.serviceOptimizationInsights(); }
}
