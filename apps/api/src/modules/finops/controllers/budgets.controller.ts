import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BudgetGovernanceService } from '../budget-governance.service';
import { CreateBudgetTrackingDto, CreateCostAlertDto, CreateFinOpsPolicyDto } from '../dto/finops.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'budgets', version: '1' })
export class BudgetsController {
  constructor(private readonly budgets: BudgetGovernanceService) {}

  @Get('dashboard') dashboard() { return this.budgets.dashboard(); }
  @Get('policies') policies(@Query('policyType') policyType?: string, @Query('status') status?: string, @Query('enforcementMode') enforcementMode?: string) { return this.budgets.policies(policyType, status, enforcementMode); }
  @Post('policies') createPolicy(@Body() dto: CreateFinOpsPolicyDto) { return this.budgets.createPolicy(dto); }
  @Get('tracking') tracking(@Query('period') period?: string, @Query('status') status?: string) { return this.budgets.budgets(period, status); }
  @Post('tracking') createTracking(@Body() dto: CreateBudgetTrackingDto) { return this.budgets.createBudget(dto); }
  @Get('alerts') alerts(@Query('severity') severity?: string, @Query('status') status?: string, @Query('alertType') alertType?: string) { return this.budgets.alerts(severity, status, alertType); }
  @Post('alerts') createAlert(@Body() dto: CreateCostAlertDto) { return this.budgets.createAlert(dto); }
}