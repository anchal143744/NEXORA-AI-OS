import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiCustomerSuccessService } from '../ai-customer-success.service';
import { CustomerSuccessService } from '../customer-success.service';
import { CreateRenewalOpportunityDto } from '../dto/customer-experience.dto';

@ApiTags('Renewals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'renewals', version: '1' })
export class RenewalsController {
  constructor(private readonly success: CustomerSuccessService, private readonly ai: AiCustomerSuccessService) {}

  @Get() renewals(@Query('customerIdentityId') customerIdentityId?: string, @Query('status') status?: string) { return this.success.renewals(customerIdentityId, status); }
  @Post() createRenewal(@Body() dto: CreateRenewalOpportunityDto) { return this.success.createRenewal(dto); }
  @Get('recommendations') recommendations(@Query('customerIdentityId') customerIdentityId?: string) { return this.success.renewalRecommendations(customerIdentityId); }
  @Get('copilot') copilot(@Query('customerIdentityId') customerIdentityId?: string) { return this.ai.renewalRecommendations(customerIdentityId); }
}
