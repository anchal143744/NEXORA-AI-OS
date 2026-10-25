import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CommunicationsService } from '../communications.service';
import { CreateMessageAttachmentDto, CreateMessageReactionDto, SendMessageDto } from '../dto/communications.dto';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'messages', version: '1' })
export class MessagesController {
  constructor(private readonly communications: CommunicationsService) {}

  @Get() list(@Query('channelId') channelId?: string, @Query('conversationId') conversationId?: string) { return this.communications.messages(channelId, conversationId); }
  @Post() send(@Body() dto: SendMessageDto) { return this.communications.sendMessage(dto); }
  @Get('search') search(@Query('query') query = '') { return this.communications.searchMessages(query); }
  @Post(':id/attachments') attachment(@Param('id') id: string, @Body() dto: CreateMessageAttachmentDto) { return this.communications.addAttachment(id, dto); }
  @Post(':id/reactions') reaction(@Param('id') id: string, @Body() dto: CreateMessageReactionDto) { return this.communications.react(id, dto); }
  @Patch(':id/read') read(@Param('id') id: string) { return this.communications.markRead(id); }
}