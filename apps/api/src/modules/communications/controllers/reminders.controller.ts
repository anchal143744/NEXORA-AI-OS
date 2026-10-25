import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CalendarService } from '../calendar.service';
import { CreateReminderDto } from '../dto/communications.dto';

@ApiTags('Reminders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'reminders', version: '1' })
export class RemindersController {
  constructor(private readonly calendars: CalendarService) {}

  @Get() list(@Query('status') status?: string) { return this.calendars.reminders(status); }
  @Post() create(@Body() dto: CreateReminderDto) { return this.calendars.createReminder(dto); }
  @Get('due') due() { return this.calendars.dueReminders(); }
  @Patch(':id/complete') complete(@Param('id') id: string) { return this.calendars.completeReminder(id); }
}