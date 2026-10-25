import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateHrCopilotQueryDto, CreateHrRecommendationDto } from '../dto/workforce.dto';
import { WorkforceAnalyticsService } from '../workforce-analytics.service';
import { WorkforceCommandService } from '../workforce-command.service';
import { WorkforceQueryService } from '../workforce-query.service';

@ApiTags('AI HR Copilot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'ai-hr-copilot', version: '1' })
export class AiHrCopilotController {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService, private readonly analytics: WorkforceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('AI HR Copilot');
  }

  @Get('queries') listHrCopilotQuery(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('hrCopilotQuery', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('queries') createHrCopilotQuery(@Body() dto: CreateHrCopilotQueryDto) {
    return this.commands.create('hrCopilotQuery', dto);
  }

  @Get('recommendations') listHrRecommendation(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('hrRecommendation', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('recommendations') createHrRecommendation(@Body() dto: CreateHrRecommendationDto) {
    return this.commands.create('hrRecommendation', dto);
  }
}

