import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiAuditComplianceService } from '../ai-audit-compliance.service';
import { CreateAIAuditLogDto } from '../dto/ai-governance.dto';

@ApiTags('AI Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'ai-audit', version: '1' })
export class AiAuditController {
  constructor(private readonly audit: AiAuditComplianceService) {}

  @Get('logs') logs(@Query('action') action?: string, @Query('severity') severity?: string) { return this.audit.auditLogs(action, severity); }
  @Post('logs') createLog(@Body() dto: CreateAIAuditLogDto) { return this.audit.createAuditLog(dto); }
  @Get('trail') trail(@Query('aiModelId') aiModelId?: string, @Query('decisionId') decisionId?: string) { return this.audit.auditTrail(aiModelId, decisionId); }
}