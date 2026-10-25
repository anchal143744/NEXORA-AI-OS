import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiGovernanceService } from '../ai-governance.service';

@ApiTags('AI Governance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'ai-governance', version: '1' })
export class AiGovernanceController {
  constructor(private readonly governance: AiGovernanceService) {}

  @Get('center') center() { return this.governance.center(); }
  @Get('risk-monitoring') riskMonitoring() { return this.governance.riskMonitoring(); }
  @Get('policy') policy() { return this.governance.policy(); }
  @Get('auditability') auditability() { return this.governance.auditability(); }
}