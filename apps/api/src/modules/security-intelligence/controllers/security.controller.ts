import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SecurityIntelligenceService } from '../security-intelligence.service';

@ApiTags('Security')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'security', version: '1' })
export class SecurityController {
  constructor(private readonly security: SecurityIntelligenceService) {}

  @Get('command-center') commandCenter() { return this.security.commandCenter(); }
  @Get('dashboard') dashboard() { return this.security.dashboard(); }
  @Get('compliance-monitoring') complianceMonitoring() { return this.security.complianceMonitoring(); }
  @Get('posture') posture() { return this.security.posture(); }
}