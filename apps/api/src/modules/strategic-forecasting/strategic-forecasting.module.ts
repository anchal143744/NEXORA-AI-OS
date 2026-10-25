import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { BudgetPlanningService } from './budget-planning.service';
import { BudgetPlanningController } from './controllers/budget-planning.controller';
import { CapacityPlanningController } from './controllers/capacity-planning.controller';
import { ForecastingController } from './controllers/forecasting.controller';
import { GrowthForecastController } from './controllers/growth-forecast.controller';
import { PredictionsController } from './controllers/predictions.controller';
import { RiskForecastController } from './controllers/risk-forecast.controller';
import { ScenariosController } from './controllers/scenarios.controller';
import { StrategicPlanningController } from './controllers/strategic-planning.controller';
import { CapacityPlanningService } from './capacity-planning.service';
import { ForecastingService } from './forecasting.service';
import { GrowthRiskForecastService } from './growth-risk-forecast.service';
import { PredictionService } from './prediction.service';
import { ScenarioModelingService } from './scenario-modeling.service';
import { StrategicPlanningService } from './strategic-planning.service';
import { StrategyCopilotService } from './strategy-copilot.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [ForecastingController, PredictionsController, StrategicPlanningController, ScenariosController, BudgetPlanningController, CapacityPlanningController, GrowthForecastController, RiskForecastController],
  providers: [ForecastingService, PredictionService, StrategicPlanningService, ScenarioModelingService, BudgetPlanningService, CapacityPlanningService, GrowthRiskForecastService, StrategyCopilotService],
  exports: [ForecastingService, PredictionService, StrategicPlanningService, ScenarioModelingService, BudgetPlanningService, CapacityPlanningService, GrowthRiskForecastService, StrategyCopilotService],
})
export class StrategicForecastingModule {}