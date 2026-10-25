import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CalendarService } from '../calendar.service';
import { SchedulingRequestDto } from '../dto/communications.dto';

@ApiTags('Scheduling')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'scheduling', version: '1' })
export class SchedulingController {
  constructor(private readonly calendars: CalendarService) {}

  @Post('analyze') analyze(@Body() dto: SchedulingRequestDto) { return this.calendars.analyzeAvailability(dto); }
  @Post('recommendations') recommendations(@Body() dto: SchedulingRequestDto) { return this.calendars.recommendMeeting(dto); }
  @Post('optimize') optimize(@Body() dto: SchedulingRequestDto) { return this.calendars.optimizeSchedule(dto); }
  @Post('resources') resources(@Body() dto: SchedulingRequestDto) { return this.calendars.resourceScheduling(dto); }
}