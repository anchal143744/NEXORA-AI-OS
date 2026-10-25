import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CalendarService } from '../calendar.service';
import { UpsertNotificationPreferenceDto } from '../dto/communications.dto';

@ApiTags('Notification Preferences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  constructor(private readonly calendars: CalendarService) {}

  @Get('preferences') preferences(@Query('userId') userId?: string) { return this.calendars.notificationPreferences(userId); }
  @Post('preferences') upsert(@Body() dto: UpsertNotificationPreferenceDto) { return this.calendars.upsertPreference(dto); }
}