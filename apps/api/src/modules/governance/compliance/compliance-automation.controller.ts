import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GenerateEvidenceDto, StartComplianceMonitorDto } from '../dto/governance.dto';
import { ComplianceAutomationService } from './compliance-automation.service';

@ApiTags('Compliance Automation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'compliance', version: '1' })
export class ComplianceAutomationController {
  constructor(private readonly compliance: ComplianceAutomationService) {}

  @Get('frameworks') frameworks() { return this.compliance.frameworks(); }
  @Get('monitoring') monitorRuns(@Query('framework') framework?: string, @Query('status') status?: string) { return this.compliance.monitorRuns(framework, status); }
  @Post('monitoring') startMonitor(@Body() dto: StartComplianceMonitorDto) { return this.compliance.startMonitor(dto); }
  @Post('monitoring/:id/complete') completeMonitor(@Param('id') id: string) { return this.compliance.completeMonitor(id); }
  @Get('evidence') evidence(@Query('framework') framework?: string) { return this.compliance.evidence(framework); }
  @Post('evidence') generateEvidence(@Body() dto: GenerateEvidenceDto) { return this.compliance.generateEvidence(dto); }
  @Get('gdpr/readiness') gdprReadiness() { return this.compliance.gdprReadiness(); }
  @Get('ccpa/readiness') ccpaReadiness() { return this.compliance.ccpaReadiness(); }
}