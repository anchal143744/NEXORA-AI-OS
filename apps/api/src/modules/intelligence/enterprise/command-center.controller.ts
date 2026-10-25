
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EnterpriseIntelligenceService } from './enterprise-intelligence.service';
import { UniversalCommandDto } from './enterprise-intelligence.dto';

@ApiTags('Universal Command Center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'command-center', version: '1' })
export class CommandCenterController {
  constructor(private readonly intelligence: EnterpriseIntelligenceService) {}

  @Post('ai-command') runCommand(@Body() dto: UniversalCommandDto) { return this.intelligence.runCommand(dto); }
  @Get('launch-plan') launchPlan() { return this.intelligence.launchPlan(); }
  @Post('workspaces') createWorkspace(@Body() plan: { workspaceId: string; [key: string]: unknown }) { return this.intelligence.acknowledgeWorkspaceLaunch(plan); }
}
