import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSecurityThreatDto, CreateThreatDetectionRuleDto, CreateThreatEventDto } from '../dto/security-intelligence.dto';
import { ThreatDetectionService } from '../threat-detection.service';

@ApiTags('Threat Detection')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'threat-detection', version: '1' })
export class ThreatDetectionController {
  constructor(private readonly threats: ThreatDetectionService) {}

  @Get('monitoring') monitoring() { return this.threats.monitoring(); }
  @Get('rules') rules(@Query('ruleType') ruleType?: string, @Query('status') status?: string, @Query('severity') severity?: string) { return this.threats.rules(ruleType, status, severity); }
  @Post('rules') createRule(@Body() dto: CreateThreatDetectionRuleDto) { return this.threats.createRule(dto); }
  @Get('threats') threatsList(@Query('threatType') threatType?: string, @Query('severity') severity?: string, @Query('status') status?: string) { return this.threats.threats(threatType, severity, status); }
  @Post('threats') createThreat(@Body() dto: CreateSecurityThreatDto) { return this.threats.createThreat(dto); }
  @Get('events') events(@Query('eventType') eventType?: string, @Query('severity') severity?: string, @Query('status') status?: string) { return this.threats.eventsList(eventType, severity, status); }
  @Post('events') createEvent(@Body() dto: CreateThreatEventDto) { return this.threats.createThreatEvent(dto); }
}