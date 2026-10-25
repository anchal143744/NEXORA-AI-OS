import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiCustomerSuccessService } from '../ai-customer-success.service';
import { CustomerExperienceService } from '../customer-experience.service';
import { CreateCustomerFeedbackDto, CreateCustomerJourneyDto, UpdateJourneyStageDto } from '../dto/customer-experience.dto';

@ApiTags('Customer Experience')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'customer-experience', version: '1' })
export class CustomerExperienceController {
  constructor(private readonly experience: CustomerExperienceService, private readonly ai: AiCustomerSuccessService) {}

  @Get('dashboard') dashboard(@Query('customerIdentityId') customerIdentityId?: string) { return this.experience.dashboard(customerIdentityId); }
  @Get('journeys') journeys(@Query('customerIdentityId') customerIdentityId?: string, @Query('lifecycleStage') lifecycleStage?: string) { return this.experience.journeys(customerIdentityId, lifecycleStage); }
  @Post('journeys') createJourney(@Body() dto: CreateCustomerJourneyDto) { return this.experience.createJourney(dto); }
  @Patch('journeys/:id/stage') updateJourneyStage(@Param('id') id: string, @Body() dto: UpdateJourneyStageDto) { return this.experience.updateJourneyStage(id, dto); }
  @Get('lifecycle') lifecycle() { return this.experience.lifecycleMonitoring(); }
  @Get('risks') risks(@Query('customerIdentityId') customerIdentityId?: string) { return this.experience.riskDetection(customerIdentityId); }
  @Get('satisfaction') satisfaction(@Query('customerIdentityId') customerIdentityId?: string) { return this.experience.satisfaction(customerIdentityId); }
  @Post('feedback') createFeedback(@Body() dto: CreateCustomerFeedbackDto) { return this.experience.createFeedback(dto); }
  @Get('copilot/health-insights') healthInsights(@Query('customerIdentityId') customerIdentityId?: string) { return this.ai.healthInsights(customerIdentityId); }
}
