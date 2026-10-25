
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSupplyChainCopilotQueryDto } from '../dto/supply-chain.dto';
import { SupplyChainIntelligenceService } from '../supply-chain-intelligence.service';

@ApiTags('Supply Chain Copilot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'supply-chain-copilot', version: '1' })
export class SupplyChainCopilotController {
  constructor(private readonly intelligence: SupplyChainIntelligenceService) {}
  @Get('queries') queries(@Query('status') status?: string, @Query('userId') userId?: string) { return this.intelligence.copilotQueries(status, userId); }
  @Post('queries') createQuery(@Body() dto: CreateSupplyChainCopilotQueryDto) { return this.intelligence.createCopilotQuery(dto); }
}
