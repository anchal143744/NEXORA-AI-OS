import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAIDecisionDto, CreateAIDecisionReasonDto, CreateAIDecisionRiskDto } from '../dto/ai-governance.dto';
import { DecisionIntelligenceService } from '../decision-intelligence.service';

@ApiTags('Decision Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'decision-intelligence', version: '1' })
export class DecisionIntelligenceController {
  constructor(private readonly decisions: DecisionIntelligenceService) {}

  @Get('dashboard') dashboard() { return this.decisions.dashboard(); }
  @Get('decisions') decisionsList(@Query('decisionType') decisionType?: string, @Query('riskLevel') riskLevel?: string, @Query('humanReviewed') humanReviewed?: string) { return this.decisions.decisions(decisionType, riskLevel, humanReviewed === undefined ? undefined : humanReviewed === 'true'); }
  @Post('decisions') createDecision(@Body() dto: CreateAIDecisionDto) { return this.decisions.createDecision(dto); }
  @Get('reasons') reasons(@Query('decisionId') decisionId?: string) { return this.decisions.reasons(decisionId); }
  @Post('reasons') addReason(@Body() dto: CreateAIDecisionReasonDto) { return this.decisions.addReason(dto); }
  @Get('risks') risks(@Query('decisionId') decisionId?: string, @Query('severity') severity?: string, @Query('status') status?: string) { return this.decisions.risks(decisionId, severity, status); }
  @Post('risks') addRisk(@Body() dto: CreateAIDecisionRiskDto) { return this.decisions.addRisk(dto); }
}