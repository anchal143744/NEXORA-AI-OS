import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiMonetizationService } from '../api-monetization.service';
import { CreateGovernancePolicyDto, CreateRateLimitPolicyDto } from '../dto/platform-governance.dto';
import { PlatformGovernanceService } from '../platform-governance.service';

@ApiTags('API Governance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'api-governance', version: '1' })
export class ApiGovernanceController {
  constructor(private readonly center: PlatformGovernanceService, private readonly monetization: ApiMonetizationService) {}

  @Get('center') governanceCenter() { return this.center.governanceCenter(); }
  @Get('policies') policies(@Query('policyType') policyType?: string, @Query('status') status?: string, @Query('enforcementMode') enforcementMode?: string) { return this.monetization.policies(policyType, status, enforcementMode); }
  @Post('policies') createPolicy(@Body() dto: CreateGovernancePolicyDto) { return this.monetization.createPolicy(dto); }
  @Get('rate-limits') rateLimits(@Query('apiProductId') apiProductId?: string, @Query('scopeType') scopeType?: string, @Query('status') status?: string) { return this.monetization.rateLimits(apiProductId, scopeType, status); }
  @Post('rate-limits') createRateLimit(@Body() dto: CreateRateLimitPolicyDto) { return this.monetization.createRateLimit(dto); }
}
