import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiCustomerSuccessService } from '../ai-customer-success.service';
import { CustomerSuccessService } from '../customer-success.service';
import { CreateCustomerEngagementScoreDto, CreateCustomerSuccessPlanDto } from '../dto/customer-experience.dto';

@ApiTags('Customer Success')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'customer-success', version: '1' })
export class CustomerSuccessController {
  constructor(private readonly success: CustomerSuccessService, private readonly ai: AiCustomerSuccessService) {}

  @Get('plans') plans(@Query('customerIdentityId') customerIdentityId?: string, @Query('status') status?: string) { return this.success.plans(customerIdentityId, status); }
  @Post('plans') createPlan(@Body() dto: CreateCustomerSuccessPlanDto) { return this.success.createPlan(dto); }
  @Get('follow-ups') followUps(@Query('customerIdentityId') customerIdentityId?: string) { return this.success.automatedFollowUps(customerIdentityId); }
  @Get('adoption') adoption(@Query('customerIdentityId') customerIdentityId?: string) { return this.success.adoptionMonitoring(customerIdentityId); }
  @Get('engagement-scores') engagementScores(@Query('customerIdentityId') customerIdentityId?: string) { return this.success.engagementScores(customerIdentityId); }
  @Post('engagement-scores') createEngagementScore(@Body() dto: CreateCustomerEngagementScoreDto) { return this.success.createEngagementScore(dto); }
  @Get('copilot/recommendations') recommendations(@Query('customerIdentityId') customerIdentityId?: string) { return this.ai.engagementRecommendations(customerIdentityId); }
  @Get('copilot/service-optimization') serviceOptimization() { return this.ai.serviceOptimizationInsights(); }
}
