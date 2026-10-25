import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CalendarService } from '../calendar.service';
import { CreateCalendarEventDto } from '../dto/communications.dto';

@ApiTags('Calendar Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'calendar-events', version: '1' })
export class CalendarEventsController {
  constructor(private readonly calendars: CalendarService) {}

  @Get() list(@Query('calendarId') calendarId?: string, @Query('status') status?: string) { return this.calendars.events(calendarId, status); }
  @Post() create(@Body() dto: CreateCalendarEventDto) { return this.calendars.createEvent(dto); }
  @Get(':id') get(@Param('id') id: string) { return this.calendars.getEvent(id); }
  @Post(':id/participants') participant(@Param('id') id: string, @Body() dto: { userId?: string; email?: string; participantRole?: string; required?: boolean }) { return this.calendars.addEventParticipant(id, dto); }
}