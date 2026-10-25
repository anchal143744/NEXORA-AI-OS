import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateStrategicGoalDto, CreateStrategicPlanDto } from '../dto/strategic-forecasting.dto';
import { StrategicPlanningService } from '../strategic-planning.service';
import { StrategyCopilotService } from '../strategy-copilot.service';

@ApiTags('Strategic Planning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'strategic-planning', version: '1' })
export class StrategicPlanningController {
  constructor(private readonly planning: StrategicPlanningService, private readonly copilot: StrategyCopilotService) {}

  @Get('plans') plans(@Query('status') status?: string, @Query('planType') planType?: string) { return this.planning.plans(status, planType); }
  @Post('plans') createPlan(@Body() dto: CreateStrategicPlanDto) { return this.planning.createPlan(dto); }
  @Get('goals') goals(@Query('status') status?: string, @Query('goalType') goalType?: string) { return this.planning.goals(status, goalType); }
  @Post('goals') createGoal(@Body() dto: CreateStrategicGoalDto) { return this.planning.createGoal(dto); }
  @Get('kpi-planning') kpiPlanning() { return this.planning.kpiPlanning(); }
  @Get('department-planning') departmentPlanning() { return this.planning.departmentPlanning(); }
  @Get('recommendations') recommendations() { return this.copilot.recommendations(); }
}