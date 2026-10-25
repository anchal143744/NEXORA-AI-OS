import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DataResidencyService } from '../data-residency.service';

@ApiTags('Regulatory Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'regulatory-intelligence', version: '1' })
export class RegulatoryIntelligenceController {
  constructor(private readonly center: DataResidencyService) {}

  @Get('dashboard') dashboard() { return this.center.dashboard(); }
  @Get('recommendations') recommendations() { return this.center.intelligence(); }
  @Get('risk-summary') riskSummary() { return this.center.regulatoryOperations(); }
  @Get('residency-summary') residencySummary() { return this.center.residencyCenter(); }
}