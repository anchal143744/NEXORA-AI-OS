
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateDemandForecastModelDto, CreateDemandForecastScenarioDto } from '../dto/supply-chain.dto';
import { SupplyChainPlanningService } from '../supply-chain-planning.service';

@ApiTags('Demand Forecasting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'demand-forecasting', version: '1' })
export class DemandForecastingController {
  constructor(private readonly planning: SupplyChainPlanningService) {}
  @Get('dashboard') dashboard() { return this.planning.forecastingDashboard(); }
  @Get('models') models(@Query('status') status?: string, @Query('modelType') modelType?: string) { return this.planning.forecastModels(status, modelType); }
  @Post('models') createModel(@Body() dto: CreateDemandForecastModelDto) { return this.planning.createForecastModel(dto); }
  @Get('scenarios') scenarios(@Query('status') status?: string, @Query('scenarioType') scenarioType?: string, @Query('itemId') itemId?: string) { return this.planning.forecastScenarios(status, scenarioType, itemId); }
  @Post('scenarios') createScenario(@Body() dto: CreateDemandForecastScenarioDto) { return this.planning.createForecastScenario(dto); }
}
