import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ContactCenterService } from '../contact-center.service';
import { CreateAgentAssignmentDto, CreateEscalationDto, AddConversationParticipantDto } from '../dto/contact-center.dto';
import { ConversationIntelligenceService } from '../conversation-intelligence.service';
import { OmnichannelEngagementService } from '../omnichannel-engagement.service';

@ApiTags('Omnichannel Conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'conversations', version: '1' })
export class OmnichannelConversationsController {
  constructor(private readonly omnichannel: OmnichannelEngagementService, private readonly contactCenter: ContactCenterService, private readonly intelligence: ConversationIntelligenceService) {}

  @Get(':id/participants') participants(@Param('id') id: string) { return this.omnichannel.participants(id); }
  @Post(':id/participants') addParticipant(@Param('id') id: string, @Body() dto: AddConversationParticipantDto) { return this.omnichannel.addParticipant(id, dto); }
  @Get(':id/timeline') timeline(@Param('id') id: string) { return this.omnichannel.timeline(id); }
  @Get(':id/omnichannel-context') context(@Param('id') id: string) { return this.omnichannel.timeline(id); }
  @Get(':id/intelligence') insights(@Param('id') id: string) { return this.intelligence.insights(id); }
  @Post(':id/assign') assign(@Param('id') id: string, @Body() dto: CreateAgentAssignmentDto) { return this.contactCenter.createAssignment({ ...dto, conversationId: id }); }
  @Post(':id/escalate') escalate(@Param('id') id: string, @Body() dto: CreateEscalationDto) { return this.contactCenter.escalate({ ...dto, conversationId: id }); }
}
