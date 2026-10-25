import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ConversationIntelligenceService } from '../conversation-intelligence.service';
import { ConversationActionExtractionDto, CreateConversationSummaryDto, EscalationRecommendationDto, IntentDetectionDto, RiskDetectionDto, SentimentAnalysisDto } from '../dto/contact-center.dto';

@ApiTags('Conversation Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'conversation-intelligence', version: '1' })
export class ConversationIntelligenceController {
  constructor(private readonly intelligence: ConversationIntelligenceService) {}

  @Post('sentiment') analyzeSentiment(@Body() dto: SentimentAnalysisDto) { return this.intelligence.analyzeSentiment(dto); }
  @Post('intent') detectIntent(@Body() dto: IntentDetectionDto) { return this.intelligence.detectIntent(dto); }
  @Post('summaries') summarize(@Body() dto: CreateConversationSummaryDto) { return this.intelligence.summarize(dto); }
  @Get('conversations/:id/insights') insights(@Param('id') id: string) { return this.intelligence.insights(id); }
  @Post('action-extraction') extractActions(@Body() dto: ConversationActionExtractionDto) { return this.intelligence.extractActions(dto); }
  @Post('risk-detection') detectRisk(@Body() dto: RiskDetectionDto) { return this.intelligence.detectRisk(dto); }
  @Post('escalation-recommendation') recommendEscalation(@Body() dto: EscalationRecommendationDto) { return this.intelligence.recommendEscalation(dto); }
}
