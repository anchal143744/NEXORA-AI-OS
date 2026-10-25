import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FinOpsService } from '../finops.service';

@ApiTags('FinOps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'finops', version: '1' })
export class FinOpsController {
  constructor(private readonly finops: FinOpsService) {}

  @Get('dashboard') dashboard() { return this.finops.dashboard(); }
  @Get('command-center') commandCenter() { return this.finops.commandCenter(); }
  @Get('cost-summary') costSummary() { return this.finops.costSummary(); }
  @Get('optimization-summary') optimizationSummary() { return this.finops.optimizationSummary(); }
  @Get('allocation-summary') allocationSummary() { return this.finops.allocationSummary(); }
  @Get('policy-summary') policySummary() { return this.finops.policySummary(); }
}