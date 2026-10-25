import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSecurityRiskDto, CreateSecurityScoreDto } from '../dto/security-intelligence.dto';
import { SecurityRiskService } from '../security-risk.service';

@ApiTags('Security Risk')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'security-risk', version: '1' })
export class SecurityRiskController {
  constructor(private readonly risk: SecurityRiskService) {}

  @Get('assessment') assessment() { return this.risk.assessment(); }
  @Get('risks') risks(@Query('riskType') riskType?: string, @Query('severity') severity?: string, @Query('status') status?: string) { return this.risk.risks(riskType, severity, status); }
  @Post('risks') createRisk(@Body() dto: CreateSecurityRiskDto) { return this.risk.createRisk(dto); }
  @Get('scores') scores(@Query('scopeType') scopeType?: string, @Query('scoreBand') scoreBand?: string) { return this.risk.scores(scopeType, scoreBand); }
  @Post('scores') createScore(@Body() dto: CreateSecurityScoreDto) { return this.risk.createScore(dto); }
}