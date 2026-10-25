
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateBudgetAllocationDto } from '../dto/procurement.dto';
import { SpendIntelligenceService } from '../spend-intelligence.service';

@ApiTags('Budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'budgets', version: '1' })
export class BudgetsController {
  constructor(private readonly spend: SpendIntelligenceService) {}
  @Get('dashboard') dashboard() { return this.spend.budgetDashboard(); }
  @Get() list(@Query('status') status?: string, @Query('purchaseCategoryId') purchaseCategoryId?: string) { return this.spend.budgets(status, purchaseCategoryId); }
  @Post() create(@Body() dto: CreateBudgetAllocationDto) { return this.spend.createBudget(dto); }
}
