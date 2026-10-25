import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { OkrManagementController } from './controllers/okr-management.controller';
import { StrategicPlanningController } from './controllers/strategic-planning.controller';
import { PortfolioManagementController } from './controllers/portfolio-management.controller';
import { ResourcePlanningController } from './controllers/resource-planning.controller';
import { CapacityPlanningController } from './controllers/capacity-planning.controller';
import { BudgetPlanningController } from './controllers/budget-planning.controller';
import { ScenarioModelingController } from './controllers/scenario-modeling.controller';
import { ExecutivePlanningDashboardsController } from './controllers/executive-planning-dashboards.controller';
import { PortfolioAnalyticsController } from './controllers/portfolio-analytics.controller';
import { AiStrategyCopilotController } from './controllers/ai-strategy-copilot.controller';
import { PlanningAnalyticsService } from './planning-analytics.service';
import { PlanningCommandService } from './planning-command.service';
import { PlanningCqrsService } from './planning-cqrs.service';
import { PlanningQueryService } from './planning-query.service';
import { PlanningReadinessService } from './planning-readiness.service';
import { PlanningService } from './planning.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [OkrManagementController, StrategicPlanningController, PortfolioManagementController, ResourcePlanningController, CapacityPlanningController, BudgetPlanningController, ScenarioModelingController, ExecutivePlanningDashboardsController, PortfolioAnalyticsController, AiStrategyCopilotController],
  providers: [PlanningService, PlanningCommandService, PlanningQueryService, PlanningCqrsService, PlanningAnalyticsService, PlanningReadinessService],
  exports: [PlanningService, PlanningCommandService, PlanningQueryService, PlanningCqrsService, PlanningAnalyticsService, PlanningReadinessService],
})
export class PlanningModule {}
