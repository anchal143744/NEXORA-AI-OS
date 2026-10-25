import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateComplianceAuditDto, CreateRegulatoryRiskDto } from '../dto/data-residency.dto';
import { RegulatoryService } from '../regulatory.service';

@ApiTags('Compliance Regulatory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'compliance', version: '1' })
export class ComplianceRegulatoryController {
  constructor(private readonly regulatory: RegulatoryService) {}

  @Get('regulatory-monitoring') monitoring() { return this.regulatory.dashboard(); }
  @Get('regulatory-audits') audits(@Query('status') status?: string, @Query('severity') severity?: string, @Query('auditType') auditType?: string) { return this.regulatory.audits(status, severity, auditType); }
  @Post('regulatory-audits') createAudit(@Body() dto: CreateComplianceAuditDto) { return this.regulatory.createAudit(dto); }
  @Get('regulatory-risks') risks(@Query('riskType') riskType?: string, @Query('severity') severity?: string, @Query('status') status?: string) { return this.regulatory.risks(riskType, severity, status); }
  @Post('regulatory-risks') createRisk(@Body() dto: CreateRegulatoryRiskDto) { return this.regulatory.createRisk(dto); }
}