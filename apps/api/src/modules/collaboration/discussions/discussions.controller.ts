import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateDiscussionDto, CreateMentionDto, CreateMessageDto, CreateReactionDto, CreateThreadDto } from '../dto/collaboration.dto';
import { DiscussionsService } from './discussions.service';

@ApiTags('Discussions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'discussions', version: '1' })
export class DiscussionsController {
  constructor(private readonly discussions: DiscussionsService) {}

  @Get() list(@Query('status') status?: string, @Query('spaceId') spaceId?: string) { return this.discussions.discussions(status, spaceId); }
  @Post() create(@Body() dto: CreateDiscussionDto) { return this.discussions.createDiscussion(dto); }
  @Get('search') search(@Query('query') query = '') { return this.discussions.searchDiscussions(query); }
  @Get(':id') get(@Param('id') id: string) { return this.discussions.getDiscussion(id); }
  @Post(':id/threads') createThread(@Param('id') id: string, @Body() dto: CreateThreadDto) { return this.discussions.createThread(id, dto); }
  @Post(':id/messages') createMessage(@Param('id') id: string, @Body() dto: CreateMessageDto) { return this.discussions.createMessage(id, dto); }
  @Get(':id/messages') messages(@Param('id') id: string, @Query('threadId') threadId?: string) { return this.discussions.messages(id, threadId); }
  @Post('messages/:id/mentions') mention(@Param('id') id: string, @Body() dto: CreateMentionDto) { return this.discussions.createMention(id, dto); }
  @Post('messages/:id/reactions') reaction(@Param('id') id: string, @Body() dto: CreateReactionDto) { return this.discussions.createReaction(id, dto); }
}