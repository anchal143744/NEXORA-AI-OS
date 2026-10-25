import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateIncidentTimelineDto, CreateSystemIncidentDto } from '../dto/reliability-operations.dto';
import { IncidentManagementService } from '../incident-management.service';

@ApiTags('Incidents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'incidents', version: '1' })
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentManagementService) {}

  @Get() incidents(@Query('severity') severity?: string, @Query('status') status?: string, @Query('region') region?: string) { return this.incidentsService.incidents(severity, status, region); }
  @Post() createIncident(@Body() dto: CreateSystemIncidentDto) { return this.incidentsService.createIncident(dto); }
  @Get('center') center() { return this.incidentsService.incidentCenter(); }
  @Get('timelines') timelines(@Query('incidentId') incidentId?: string, @Query('eventType') eventType?: string) { return this.incidentsService.timelines(incidentId, eventType); }
  @Post('timelines') createTimeline(@Body() dto: CreateIncidentTimelineDto) { return this.incidentsService.createTimeline(dto); }
}