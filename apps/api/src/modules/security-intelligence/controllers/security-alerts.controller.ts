import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSecurityAlertDto } from '../dto/security-intelligence.dto';
import { SecurityCommandService } from '../security-command.service';

@ApiTags('Security Alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'security-alerts', version: '1' })
export class SecurityAlertsController {
  constructor(private readonly command: SecurityCommandService) {}

  @Get() alerts(@Query('severity') severity?: string, @Query('status') status?: string, @Query('alertType') alertType?: string) { return this.command.alerts(severity, status, alertType); }
  @Post() createAlert(@Body() dto: CreateSecurityAlertDto) { return this.command.createAlert(dto); }
  @Get('active') active() { return this.command.alerts(undefined, 'open'); }
  @Get('critical') critical() { return this.command.alerts('critical'); }
}