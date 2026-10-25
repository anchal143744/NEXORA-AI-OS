import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiCustomerSuccessService } from '../ai-customer-success.service';
import { CustomerExperienceService } from '../customer-experience.service';
import { CreateCustomerHealthScoreDto } from '../dto/customer-experience.dto';

@ApiTags('Customer Health')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'customer-health', version: '1' })
export class CustomerHealthController {
  constructor(private readonly experience: CustomerExperienceService, private readonly ai: AiCustomerSuccessService) {}

  @Get('scores') scores(@Query('customerIdentityId') customerIdentityId?: string, @Query('scoreBand') scoreBand?: string) { return this.experience.healthScores(customerIdentityId, scoreBand); }
  @Post('scores') createScore(@Body() dto: CreateCustomerHealthScoreDto) { return this.experience.createHealthScore(dto); }
  @Get('scores/latest/:customerIdentityId') latest(@Param('customerIdentityId') customerIdentityId: string) { return this.experience.latestHealth(customerIdentityId); }
  @Get('risk-detection') riskDetection(@Query('customerIdentityId') customerIdentityId?: string) { return this.experience.riskDetection(customerIdentityId); }
  @Get('insights') insights(@Query('customerIdentityId') customerIdentityId?: string) { return this.ai.healthInsights(customerIdentityId); }
}
