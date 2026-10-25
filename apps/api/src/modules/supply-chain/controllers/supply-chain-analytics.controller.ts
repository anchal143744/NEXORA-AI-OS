
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SupplyChainService } from '../supply-chain.service';

@ApiTags('Supply Chain Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'supply-chain-analytics', version: '1' })
export class SupplyChainAnalyticsController {
  constructor(private readonly supplyChain: SupplyChainService) {}
  @Get('dashboard') dashboard() { return this.supplyChain.dashboard(); }
}
