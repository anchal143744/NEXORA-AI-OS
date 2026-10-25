import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CalendarService } from '../calendar.service';
import { CreateCalendarDto, CreateScheduleRuleDto } from '../dto/communications.dto';

@ApiTags('Calendars')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'calendars', version: '1' })
export class CalendarsController {
  constructor(private readonly calendars: CalendarService) {}

  @Get() list(@Query('calendarType') calendarType?: string) { return this.calendars.calendars(calendarType); }
  @Post() create(@Body() dto: CreateCalendarDto) { return this.calendars.createCalendar(dto); }
  @Get(':id') get(@Param('id') id: string) { return this.calendars.getCalendar(id); }
  @Get(':id/events') events(@Param('id') id: string) { return this.calendars.events(id); }
  @Get(':id/schedule-rules') rules(@Param('id') id: string) { return this.calendars.scheduleRules(id); }
  @Post(':id/schedule-rules') createRule(@Param('id') id: string, @Body() dto: CreateScheduleRuleDto) { return this.calendars.createScheduleRule({ ...dto, calendarId: id }); }
}