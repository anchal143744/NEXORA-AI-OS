import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiCustomerSuccessService } from '../ai-customer-success.service';
import { CreateRevenueOpportunityDto, CreateRevenueRiskDto } from '../dto/customer-experience.dto';
import { RevenueEngagementService } from '../revenue-engagement.service';

@ApiTags('Revenue Opportunities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'revenue-opportunities', version: '1' })
export class RevenueOpportunitiesController {
  constructor(private readonly revenue: RevenueEngagementService, private readonly ai: AiCustomerSuccessService) {}

  @Get() opportunities(@Query('customerIdentityId') customerIdentityId?: string, @Query('opportunityType') opportunityType?: string) { return this.revenue.revenueOpportunities(customerIdentityId, opportunityType); }
  @Post() createOpportunity(@Body() dto: CreateRevenueOpportunityDto) { return this.revenue.createRevenueOpportunity(dto); }
  @Get('upsell') upsell(@Query('customerIdentityId') customerIdentityId?: string) { return this.revenue.upsellOpportunities(customerIdentityId); }
  @Post('upsell') createUpsell(@Body() dto: CreateRevenueOpportunityDto) { return this.revenue.createUpsellOpportunity(dto); }
  @Get('cross-sell') crossSell(@Query('customerIdentityId') customerIdentityId?: string) { return this.revenue.crossSellOpportunities(customerIdentityId); }
  @Post('cross-sell') createCrossSell(@Body() dto: CreateRevenueOpportunityDto) { return this.revenue.createCrossSellOpportunity(dto); }
  @Get('risks') risks(@Query('customerIdentityId') customerIdentityId?: string, @Query('severity') severity?: string) { return this.revenue.revenueRisks(customerIdentityId, severity); }
  @Post('risks') createRisk(@Body() dto: CreateRevenueRiskDto) { return this.revenue.createRevenueRisk(dto); }
  @Get('recommendations') recommendations(@Query('customerIdentityId') customerIdentityId?: string) { return this.revenue.growthRecommendations(customerIdentityId); }
  @Get('value-prediction') valuePrediction(@Query('customerIdentityId') customerIdentityId?: string) { return this.revenue.customerValuePrediction(customerIdentityId); }
  @Get('copilot') copilot(@Query('customerIdentityId') customerIdentityId?: string) { return this.ai.revenueExpansionSuggestions(customerIdentityId); }
}
