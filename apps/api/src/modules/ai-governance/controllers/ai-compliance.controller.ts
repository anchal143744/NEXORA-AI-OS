import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiAuditComplianceService } from '../ai-audit-compliance.service';
import { CreateAIComplianceRecordDto } from '../dto/ai-governance.dto';

@ApiTags('AI Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'ai-compliance', version: '1' })
export class AiComplianceController {
  constructor(private readonly compliance: AiAuditComplianceService) {}

  @Get('records') records(@Query('framework') framework?: string, @Query('status') status?: string) { return this.compliance.complianceRecords(framework, status); }
  @Post('records') createRecord(@Body() dto: CreateAIComplianceRecordDto) { return this.compliance.createComplianceRecord(dto); }
  @Get('dashboard') dashboard() { return this.compliance.complianceDashboard(); }
  @Get('frameworks') frameworks() { return { frameworks: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA', 'AI_RISK_MANAGEMENT', 'MODEL_GOVERNANCE'] }; }
}