import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSecurityIncidentDto, CreateSecurityInvestigationDto, UpdateSecurityInvestigationDto } from '../dto/security-intelligence.dto';
import { SecurityCommandService } from '../security-command.service';

@ApiTags('Security Incidents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'security-incidents', version: '1' })
export class SecurityIncidentsController {
  constructor(private readonly command: SecurityCommandService) {}

  @Get() incidents(@Query('severity') severity?: string, @Query('status') status?: string, @Query('incidentType') incidentType?: string) { return this.command.incidents(severity, status, incidentType); }
  @Post() createIncident(@Body() dto: CreateSecurityIncidentDto) { return this.command.createIncident(dto); }
  @Get('investigations') investigations(@Query('status') status?: string, @Query('priority') priority?: string) { return this.command.investigations(status, priority); }
  @Post('investigations') createInvestigation(@Body() dto: CreateSecurityInvestigationDto) { return this.command.createInvestigation(dto); }
  @Patch('investigations/:id') updateInvestigation(@Param('id') id: string, @Body() dto: UpdateSecurityInvestigationDto) { return this.command.updateInvestigation(id, dto); }
}