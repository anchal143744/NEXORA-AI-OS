import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PlatformGovernanceService } from '../platform-governance.service';

@ApiTags('API Monetization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'api-monetization', version: '1' })
export class ApiMonetizationController {
  constructor(private readonly center: PlatformGovernanceService) {}

  @Get('dashboard') dashboard() { return this.center.monetizationCenter(); }
  @Get('plans') plans() { return this.center.partnerManagement(); }
  @Get('usage') usage() { return this.center.usageAnalytics(); }
  @Get('billing') billing() { return this.center.billingCenter(); }
  @Get('governance') governance() { return this.center.governanceCenter(); }
}
