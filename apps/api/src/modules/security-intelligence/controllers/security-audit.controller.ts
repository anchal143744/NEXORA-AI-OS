import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateComplianceViolationDto, CreateSecurityAuditDto } from '../dto/security-intelligence.dto';
import { SecurityAuditService } from '../security-audit.service';

@ApiTags('Security Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'security-audit', version: '1' })
export class SecurityAuditController {
  constructor(private readonly audit: SecurityAuditService) {}

  @Get('audits') audits(@Query('auditType') auditType?: string, @Query('action') action?: string, @Query('severity') severity?: string) { return this.audit.audits(auditType, action, severity); }
  @Post('audits') createAudit(@Body() dto: CreateSecurityAuditDto) { return this.audit.createAudit(dto); }
  @Get('compliance-violations') violations(@Query('framework') framework?: string, @Query('status') status?: string, @Query('severity') severity?: string) { return this.audit.complianceViolations(framework, status, severity); }
  @Post('compliance-violations') createViolation(@Body() dto: CreateComplianceViolationDto) { return this.audit.createViolation(dto); }
  @Get('compliance-monitoring') complianceMonitoring() { return this.audit.complianceMonitoring(); }
}