import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AddMeetingParticipantDto, CreateMeetingActionDto, CreateMeetingAgendaDto, CreateMeetingDecisionDto, CreateMeetingDto } from '../dto/communications.dto';
import { MeetingsService } from '../meetings.service';

@ApiTags('Meetings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'meetings', version: '1' })
export class MeetingsController {
  constructor(private readonly meetings: MeetingsService) {}

  @Get() list(@Query('status') status?: string) { return this.meetings.meetings(status); }
  @Post() create(@Body() dto: CreateMeetingDto) { return this.meetings.createMeeting(dto); }
  @Get('templates') templates() { return this.meetings.templates(); }
  @Get(':id') get(@Param('id') id: string) { return this.meetings.getMeeting(id); }
  @Post(':id/participants') participant(@Param('id') id: string, @Body() dto: AddMeetingParticipantDto) { return this.meetings.addParticipant(id, dto); }
  @Post(':id/agendas') agenda(@Param('id') id: string, @Body() dto: CreateMeetingAgendaDto) { return this.meetings.addAgenda(id, dto); }
  @Post(':id/decisions') decision(@Param('id') id: string, @Body() dto: CreateMeetingDecisionDto) { return this.meetings.addDecision(id, dto); }
  @Post(':id/action-items') action(@Param('id') id: string, @Body() dto: CreateMeetingActionDto) { return this.meetings.addAction(id, dto); }
  @Get(':id/history') history(@Param('id') id: string) { return this.meetings.history(id); }
}