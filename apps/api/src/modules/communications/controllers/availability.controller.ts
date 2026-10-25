import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CalendarService } from '../calendar.service';
import { CreateAvailabilityWindowDto, SchedulingRequestDto } from '../dto/communications.dto';

@ApiTags('Availability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'availability', version: '1' })
export class AvailabilityController {
  constructor(private readonly calendars: CalendarService) {}

  @Get() list(@Query('userId') userId?: string, @Query('calendarId') calendarId?: string) { return this.calendars.availability(userId, calendarId); }
  @Post() create(@Body() dto: CreateAvailabilityWindowDto) { return this.calendars.createAvailability(dto); }
  @Post('analyze') analyze(@Body() dto: SchedulingRequestDto) { return this.calendars.analyzeAvailability(dto); }
}