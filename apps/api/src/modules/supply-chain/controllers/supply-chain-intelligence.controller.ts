
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSupplyChainInsightDto, CreateSupplyChainRiskDto } from '../dto/supply-chain.dto';
import { SupplyChainIntelligenceService } from '../supply-chain-intelligence.service';

@ApiTags('Supply Chain Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'supply-chain-intelligence', version: '1' })
export class SupplyChainIntelligenceController {
  constructor(private readonly intelligence: SupplyChainIntelligenceService) {}
  @Get('dashboard') dashboard() { return this.intelligence.intelligenceDashboard(); }
  @Get('risks') risks(@Query('severity') severity?: string, @Query('status') status?: string, @Query('riskType') riskType?: string) { return this.intelligence.risks(severity, status, riskType); }
  @Post('risks') createRisk(@Body() dto: CreateSupplyChainRiskDto) { return this.intelligence.createRisk(dto); }
  @Get('insights') insights(@Query('severity') severity?: string, @Query('status') status?: string, @Query('insightType') insightType?: string) { return this.intelligence.insights(severity, status, insightType); }
  @Post('insights') createInsight(@Body() dto: CreateSupplyChainInsightDto) { return this.intelligence.createInsight(dto); }
}
