import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateStatusIncidentDto } from '../dto/ecosystem.dto';
import { EcosystemCatalogService } from '../ecosystem-catalog.service';
import { EcosystemService } from '../ecosystem.service';

@ApiTags('Public Status Center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'status-center', version: '1' })
export class StatusCenterController {
  constructor(private readonly catalog: EcosystemCatalogService, private readonly center: EcosystemService) {}
  @Get('dashboard') dashboard() { return this.center.statusCenter(); }
  @Get('incidents') incidents(@Query('severity') severity?: string, @Query('status') status?: string, @Query('incidentType') incidentType?: string) { return this.catalog.statusIncidents(severity, status, incidentType); }
  @Post('incidents') createIncident(@Body() dto: CreateStatusIncidentDto) { return this.catalog.createStatusIncident(dto); }
}
