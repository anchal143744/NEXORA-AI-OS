import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateChannelDto } from '../../communications/dto/communications.dto';
import { OmnichannelEngagementService } from '../omnichannel-engagement.service';

@ApiTags('Communication Channels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'communication-channels', version: '1' })
export class CommunicationChannelsController {
  constructor(private readonly omnichannel: OmnichannelEngagementService) {}

  @Get() channels(@Query('channelType') channelType?: string) { return this.omnichannel.channels(channelType); }
  @Post() createChannel(@Body() dto: CreateChannelDto) { return this.omnichannel.createChannel(dto); }
  @Get('omnichannel') omnichannelChannels() { return this.omnichannel.channels(); }
  @Get(':id/health') channelHealth(@Param('id') id: string) { return this.omnichannel.channelHealth(id); }
}
