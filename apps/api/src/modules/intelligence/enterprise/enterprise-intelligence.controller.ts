
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EnterpriseIntelligenceService } from './enterprise-intelligence.service';
import { UniversalCommandDto, UniversalSearchDto } from './enterprise-intelligence.dto';

@ApiTags('Enterprise Intelligence Layer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'enterprise-intelligence', version: '1' })
export class EnterpriseIntelligenceController {
  constructor(private readonly intelligence: EnterpriseIntelligenceService) {}

  @Post('sync') sync(@Body() dto: { workspaceId?: string }) { return this.intelligence.syncIntelligenceLayer(dto.workspaceId); }
  @Post('search') search(@Body() dto: UniversalSearchDto) { return this.intelligence.universalSearch(dto); }
  @Post('command') command(@Body() dto: UniversalCommandDto) { return this.intelligence.runCommand(dto); }
  @Get('decisions') decisions(@Query('workspaceId') workspaceId?: string) { return this.intelligence.decisionEngine(workspaceId); }
  @Get('executive-dashboard') dashboard(@Query('workspaceId') workspaceId?: string) { return this.intelligence.executiveDashboard(workspaceId); }
  @Get('activity-stream') activity(@Query('workspaceId') workspaceId?: string, @Query('limit') limit?: string) { return this.intelligence.activityStream(workspaceId, limit ? Number(limit) : 100); }
  @Get('notifications') notifications(@Query('workspaceId') workspaceId?: string, @Query('limit') limit?: string) { return this.intelligence.notificationIntelligence(workspaceId, limit ? Number(limit) : 100); }
}
