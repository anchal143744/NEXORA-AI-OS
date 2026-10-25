import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateBudgetPlanDto } from '../dto/strategic-forecasting.dto';
import { BudgetPlanningService } from '../budget-planning.service';

@ApiTags('Budget Planning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'budget-planning', version: '1' })
export class BudgetPlanningController {
  constructor(private readonly budget: BudgetPlanningService) {}

  @Get() plans(@Query('fiscalYear') fiscalYear?: string, @Query('status') status?: string) { return this.budget.plans(fiscalYear, status); }
  @Post() create(@Body() dto: CreateBudgetPlanDto) { return this.budget.create(dto); }
  @Get('variance') variance() { return this.budget.variance(); }
  @Get('recommendations') recommendations() { return this.budget.recommendations(); }
}