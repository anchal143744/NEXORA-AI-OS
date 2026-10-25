import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GenerateMeetingSummaryDto } from '../dto/communications.dto';
import { MeetingsService } from '../meetings.service';

@ApiTags('Meeting Summaries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meeting-summaries', version: '1' })
export class MeetingSummariesController {
  constructor(private readonly meetings: MeetingsService) {}

  @Get() list(@Query('summaryType') summaryType?: string) { return this.meetings.summaries(summaryType); }
  @Post('meetings/:id') generate(@Param('id') id: string, @Body() dto: GenerateMeetingSummaryDto) { return this.meetings.generateSummary(id, dto); }
  @Post('meetings/:id/extract') extract(@Param('id') id: string, @Body() dto: GenerateMeetingSummaryDto) { return this.meetings.extractIntelligence(id, dto); }
}