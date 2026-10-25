import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AddChannelMemberDto, CreateChannelDto } from '../dto/communications.dto';
import { CommunicationsService } from '../communications.service';

@ApiTags('Communications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'communications', version: '1' })
export class CommunicationsController {
  constructor(private readonly communications: CommunicationsService) {}

  @Get('channels') channels(@Query('channelType') channelType?: string) { return this.communications.channels(channelType); }
  @Post('channels') createChannel(@Body() dto: CreateChannelDto) { return this.communications.createChannel(dto); }
  @Get('channels/:id') channel(@Param('id') id: string) { return this.communications.getChannel(id); }
  @Get('channels/:id/members') members(@Param('id') id: string) { return this.communications.members(id); }
  @Post('channels/:id/members') addMember(@Param('id') id: string, @Body() dto: AddChannelMemberDto) { return this.communications.addMember(id, dto); }
  @Get('history') history(@Query('channelId') channelId?: string) { return this.communications.messages(channelId); }
  @Get('search') search(@Query('query') query = '') { return this.communications.searchMessages(query); }
}