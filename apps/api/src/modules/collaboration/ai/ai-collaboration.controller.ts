import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GenerateAiSummaryDto } from '../dto/collaboration.dto';
import { AiCollaborationService } from './ai-collaboration.service';

@ApiTags('AI Collaboration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'collaboration/ai', version: '1' })
export class AiCollaborationController {
  constructor(private readonly aiCollaboration: AiCollaborationService) {}

  @Get('summaries') summaries(@Query('summaryType') summaryType?: string) { return this.aiCollaboration.summaries(summaryType); }
  @Post('summaries') generateSummary(@Body() dto: GenerateAiSummaryDto) { return this.aiCollaboration.generateSummary(dto); }
  @Post('action-items/extract') extractActions(@Body() dto: GenerateAiSummaryDto) { return this.aiCollaboration.extractActionItems(dto); }
  @Get('recommendations') recommendations(@Query('spaceId') spaceId?: string) { return this.aiCollaboration.recommendationReport(spaceId); }
}