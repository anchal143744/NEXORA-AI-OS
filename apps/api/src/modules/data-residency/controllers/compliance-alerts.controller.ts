import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateRegulatoryAlertDto } from '../dto/data-residency.dto';
import { RegulatoryService } from '../regulatory.service';

@ApiTags('Compliance Alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'compliance-alerts', version: '1' })
export class ComplianceAlertsController {
  constructor(private readonly regulatory: RegulatoryService) {}

  @Get() alerts(@Query('severity') severity?: string, @Query('status') status?: string, @Query('alertType') alertType?: string) { return this.regulatory.alerts(severity, status, alertType); }
  @Post() createAlert(@Body() dto: CreateRegulatoryAlertDto) { return this.regulatory.createAlert(dto); }
  @Get('open') open() { return this.regulatory.alerts(undefined, 'open'); }
  @Get('critical') critical() { return this.regulatory.alerts('critical'); }
}