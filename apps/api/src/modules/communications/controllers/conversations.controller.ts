import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CommunicationsService } from '../communications.service';
import { CreateConversationDto, SendMessageDto } from '../dto/communications.dto';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'conversations', version: '1' })
export class ConversationsController {
  constructor(private readonly communications: CommunicationsService) {}

  @Get() list(@Query('conversationType') conversationType?: string) { return this.communications.conversations(conversationType); }
  @Post() create(@Body() dto: CreateConversationDto) { return this.communications.createConversation(dto); }
  @Get(':id') get(@Param('id') id: string) { return this.communications.getConversation(id); }
  @Get(':id/messages') messages(@Param('id') id: string) { return this.communications.messages(undefined, id); }
  @Post(':id/messages') send(@Param('id') id: string, @Body() dto: SendMessageDto) { return this.communications.sendMessage({ ...dto, conversationId: id }); }
}