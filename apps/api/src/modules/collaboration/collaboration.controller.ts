import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CollaborationFeedService } from './collaboration-feed.service';
import { CreateActionItemDto, CreateCollaborationActivityDto } from './dto/collaboration.dto';

@ApiTags('Collaboration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'collaboration', version: '1' })
export class CollaborationController {
  constructor(private readonly feed: CollaborationFeedService) {}

  @Get('activity') activity(@Query('spaceId') spaceId?: string) { return this.feed.activity(spaceId); }
  @Post('activity') createActivity(@Body() dto: CreateCollaborationActivityDto) { return this.feed.createActivity(dto); }
  @Get('mentions') mentions(@Query('status') status?: string) { return this.feed.mentions(status); }
  @Get('action-items') actionItems(@Query('status') status?: string) { return this.feed.actionItems(status); }
  @Post('action-items') createActionItem(@Body() dto: CreateActionItemDto) { return this.feed.createActionItem(dto); }
  @Patch('action-items/:id/complete') completeActionItem(@Param('id') id: string) { return this.feed.completeActionItem(id); }
}