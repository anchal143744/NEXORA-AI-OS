import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CommunicationsService } from '../communications.service';
import { CreateAnnouncementDto } from '../dto/communications.dto';

@ApiTags('Announcements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'announcements', version: '1' })
export class AnnouncementsController {
  constructor(private readonly communications: CommunicationsService) {}

  @Get() list(@Query('status') status?: string) { return this.communications.announcements(status); }
  @Post() create(@Body() dto: CreateAnnouncementDto) { return this.communications.createAnnouncement(dto); }
  @Post(':id/publish') publish(@Param('id') id: string) { return this.communications.publishAnnouncement(id); }
}