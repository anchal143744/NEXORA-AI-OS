import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SecurityIntelligenceService } from '../security-intelligence.service';

@ApiTags('Security Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'security-intelligence', version: '1' })
export class SecurityIntelligenceController {
  constructor(private readonly intelligence: SecurityIntelligenceService) {}

  @Get('dashboard') dashboard() { return this.intelligence.dashboard(); }
  @Get('command-center') commandCenter() { return this.intelligence.commandCenter(); }
  @Get('threat-summary') threatSummary() { return this.intelligence.threatSummary(); }
  @Get('recommendations') recommendations() { return this.intelligence.recommendations(); }
}