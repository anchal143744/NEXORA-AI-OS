import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');
const appModule = fs.readFileSync(path.join(root, 'apps/api/src/app.module.ts'), 'utf8');
const apiMap = fs.readFileSync(path.join(root, 'apps/web/services/planning-api.ts'), 'utf8');
const registry = fs.readFileSync(path.join(root, 'apps/api/src/modules/events/registry/event-registry.ts'), 'utf8');

test('Phase 47 Prisma schema includes required planning model surface', () => {
  const required = ["PlanningCycle","OkrObjective","OkrKeyResult","OkrInitiative","OkrCheckIn","OkrAlignment","EnterpriseStrategicPlan","StrategyPillar","StrategicTheme","StrategyMilestone","EnterprisePortfolio","PortfolioProgram","PortfolioProject","PortfolioInvestment","PortfolioRisk","PortfolioDependency","PlanningResourcePool","ResourceDemand","PortfolioResourceAllocation","ResourceSkillRequirement","PlanningCapacityPlan","CapacityScenario","CapacityConstraint","CapacityForecastSignal","PlanningBudgetPlan","BudgetLineItem","BudgetScenario","BudgetVariance","PlanningScenario","ScenarioAssumption","ScenarioSimulation","ScenarioDecision","PlanningExecutiveDashboard","ExecutiveScorecard","PortfolioMetric","PortfolioAnalyticsSnapshot","PortfolioHealthScore","StrategyCopilotQuery","StrategyRecommendation","StrategicRiskSignal","PlanningAuditEvent"];
  for (const model of required) assert.ok(schema.includes('model ' + model + ' {'), model + ' exists in Prisma schema');
});

test('Phase 47 module, API map and planning events are registered', () => {
  assert.match(appModule, /PlanningModule/);
  for (const apiPath of ["/v1/okrs","/v1/strategic-planning","/v1/portfolios","/v1/resource-planning","/v1/capacity-planning","/v1/budget-planning","/v1/scenario-modeling","/v1/executive-planning-dashboards","/v1/portfolio-analytics","/v1/ai-strategy-copilot"]) assert.ok(apiMap.includes(apiPath), apiPath + ' exists in API map');
  for (const eventName of ['OKR_OBJECTIVE_CREATED', 'STRATEGIC_PLAN_CREATED', 'PORTFOLIO_CREATED', 'BUDGET_VARIANCE_DETECTED', 'STRATEGY_COPILOT_QUERIED']) assert.ok(registry.includes(eventName), eventName + ' registered');
});
