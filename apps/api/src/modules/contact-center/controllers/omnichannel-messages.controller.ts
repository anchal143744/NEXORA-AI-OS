import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IntentDetectionDto, SentimentAnalysisDto, SyncOmnichannelMessageDto } from '../dto/contact-center.dto';
import { ConversationIntelligenceService } from '../conversation-intelligence.service';
import { OmnichannelEngagementService } from '../omnichannel-engagement.service';

@ApiTags('Omnichannel Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'messages', version: '1' })
export class OmnichannelMessagesController {
  constructor(private readonly omnichannel: OmnichannelEngagementService, private readonly intelligence: ConversationIntelligenceService) {}

  @Post(':id/sync') sync(@Param('id') id: string, @Body() dto: SyncOmnichannelMessageDto) { return this.omnichannel.syncMessage(id, dto); }
  @Post('sync') syncNew(@Body() dto: SyncOmnichannelMessageDto) { return this.omnichannel.syncMessage('new', dto); }
  @Post(':id/sentiment') sentiment(@Param('id') id: string, @Body() dto: SentimentAnalysisDto) { return this.intelligence.analyzeSentiment({ ...dto, messageId: id }); }
  @Post(':id/intent') intent(@Param('id') id: string, @Body() dto: IntentDetectionDto) { return this.intelligence.detectIntent({ ...dto, messageId: id }); }
  @Get(':id/context') context(@Param('id') id: string) { return this.omnichannel.messageContext(id); }
}
