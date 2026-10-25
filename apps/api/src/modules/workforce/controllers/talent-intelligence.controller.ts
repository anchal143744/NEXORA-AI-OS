import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateTalentProfileDto, CreateTalentScoreDto, CreateSuccessionPlanDto, CreateRetentionRiskDto, CreateLeadershipCandidateDto } from '../dto/workforce.dto';
import { WorkforceAnalyticsService } from '../workforce-analytics.service';
import { WorkforceCommandService } from '../workforce-command.service';
import { WorkforceQueryService } from '../workforce-query.service';

@ApiTags('Talent Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'talent-intelligence', version: '1' })
export class TalentIntelligenceController {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService, private readonly analytics: WorkforceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Talent Intelligence');
  }

  @Get('talent-profiles') listTalentProfile(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('talentProfile', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('talent-profiles') createTalentProfile(@Body() dto: CreateTalentProfileDto) {
    return this.commands.create('talentProfile', dto);
  }

  @Get('talent-scores') listTalentScore(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('talentScore', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('talent-scores') createTalentScore(@Body() dto: CreateTalentScoreDto) {
    return this.commands.create('talentScore', dto);
  }

  @Get('succession-plans') listSuccessionPlan(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('successionPlan', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('succession-plans') createSuccessionPlan(@Body() dto: CreateSuccessionPlanDto) {
    return this.commands.create('successionPlan', dto);
  }

  @Get('retention-risks') listRetentionRisk(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('retentionRisk', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('retention-risks') createRetentionRisk(@Body() dto: CreateRetentionRiskDto) {
    return this.commands.create('retentionRisk', dto);
  }

  @Get('leadership-candidates') listLeadershipCandidate(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('leadershipCandidate', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('leadership-candidates') createLeadershipCandidate(@Body() dto: CreateLeadershipCandidateDto) {
    return this.commands.create('leadershipCandidate', dto);
  }
}

