export type PlanningEntity = 'planningCycle' | 'okrObjective' | 'okrKeyResult' | 'okrInitiative' | 'okrCheckIn' | 'okrAlignment' | 'enterpriseStrategicPlan' | 'strategyPillar' | 'strategicTheme' | 'strategyMilestone' | 'enterprisePortfolio' | 'portfolioProgram' | 'portfolioProject' | 'portfolioInvestment' | 'portfolioRisk' | 'portfolioDependency' | 'planningResourcePool' | 'resourceDemand' | 'portfolioResourceAllocation' | 'resourceSkillRequirement' | 'planningCapacityPlan' | 'capacityScenario' | 'capacityConstraint' | 'capacityForecastSignal' | 'planningBudgetPlan' | 'budgetLineItem' | 'budgetScenario' | 'budgetVariance' | 'planningScenario' | 'scenarioAssumption' | 'scenarioSimulation' | 'scenarioDecision' | 'planningExecutiveDashboard' | 'executiveScorecard' | 'portfolioMetric' | 'portfolioAnalyticsSnapshot' | 'portfolioHealthScore' | 'strategyCopilotQuery' | 'strategyRecommendation' | 'strategicRiskSignal' | 'planningAuditEvent';

export interface PlanningEntityDefinition {
  entity: PlanningEntity;
  model: string;
  delegate: string;
  route: string;
  group: string;
  event: string;
}

export const PLANNING_ENTITIES: PlanningEntityDefinition[] = [
  { entity: 'planningCycle', model: 'PlanningCycle', delegate: 'planningCycle', route: 'cycles', group: 'OKR Management', event: 'OKR_OBJECTIVE_CREATED' },
  { entity: 'okrObjective', model: 'OkrObjective', delegate: 'okrObjective', route: 'objectives', group: 'OKR Management', event: 'OKR_OBJECTIVE_CREATED' },
  { entity: 'okrKeyResult', model: 'OkrKeyResult', delegate: 'okrKeyResult', route: 'key-results', group: 'OKR Management', event: 'OKR_KEY_RESULT_UPDATED' },
  { entity: 'okrInitiative', model: 'OkrInitiative', delegate: 'okrInitiative', route: 'initiatives', group: 'OKR Management', event: 'OKR_OBJECTIVE_CREATED' },
  { entity: 'okrCheckIn', model: 'OkrCheckIn', delegate: 'okrCheckIn', route: 'check-ins', group: 'OKR Management', event: 'OKR_CHECK_IN_CREATED' },
  { entity: 'okrAlignment', model: 'OkrAlignment', delegate: 'okrAlignment', route: 'alignments', group: 'OKR Management', event: 'OKR_OBJECTIVE_CREATED' },
  { entity: 'enterpriseStrategicPlan', model: 'EnterpriseStrategicPlan', delegate: 'enterpriseStrategicPlan', route: 'plans', group: 'Strategic Planning', event: 'STRATEGIC_PLAN_CREATED' },
  { entity: 'strategyPillar', model: 'StrategyPillar', delegate: 'strategyPillar', route: 'pillars', group: 'Strategic Planning', event: 'STRATEGIC_PLAN_CREATED' },
  { entity: 'strategicTheme', model: 'StrategicTheme', delegate: 'strategicTheme', route: 'themes', group: 'Strategic Planning', event: 'STRATEGIC_PLAN_CREATED' },
  { entity: 'strategyMilestone', model: 'StrategyMilestone', delegate: 'strategyMilestone', route: 'milestones', group: 'Strategic Planning', event: 'STRATEGY_MILESTONE_UPDATED' },
  { entity: 'enterprisePortfolio', model: 'EnterprisePortfolio', delegate: 'enterprisePortfolio', route: 'portfolios', group: 'Portfolio Management', event: 'PORTFOLIO_CREATED' },
  { entity: 'portfolioProgram', model: 'PortfolioProgram', delegate: 'portfolioProgram', route: 'programs', group: 'Portfolio Management', event: 'PORTFOLIO_CREATED' },
  { entity: 'portfolioProject', model: 'PortfolioProject', delegate: 'portfolioProject', route: 'projects', group: 'Portfolio Management', event: 'PORTFOLIO_PROJECT_UPDATED' },
  { entity: 'portfolioInvestment', model: 'PortfolioInvestment', delegate: 'portfolioInvestment', route: 'investments', group: 'Portfolio Management', event: 'PORTFOLIO_CREATED' },
  { entity: 'portfolioRisk', model: 'PortfolioRisk', delegate: 'portfolioRisk', route: 'risks', group: 'Portfolio Management', event: 'PORTFOLIO_RISK_DETECTED' },
  { entity: 'portfolioDependency', model: 'PortfolioDependency', delegate: 'portfolioDependency', route: 'dependencies', group: 'Portfolio Management', event: 'PORTFOLIO_PROJECT_UPDATED' },
  { entity: 'planningResourcePool', model: 'PlanningResourcePool', delegate: 'planningResourcePool', route: 'resource-pools', group: 'Resource Planning', event: 'RESOURCE_PLAN_CREATED' },
  { entity: 'resourceDemand', model: 'ResourceDemand', delegate: 'resourceDemand', route: 'resource-demands', group: 'Resource Planning', event: 'RESOURCE_PLAN_CREATED' },
  { entity: 'portfolioResourceAllocation', model: 'PortfolioResourceAllocation', delegate: 'portfolioResourceAllocation', route: 'resource-allocations', group: 'Resource Planning', event: 'RESOURCE_ALLOCATION_UPDATED' },
  { entity: 'resourceSkillRequirement', model: 'ResourceSkillRequirement', delegate: 'resourceSkillRequirement', route: 'skill-requirements', group: 'Resource Planning', event: 'RESOURCE_PLAN_CREATED' },
  { entity: 'planningCapacityPlan', model: 'PlanningCapacityPlan', delegate: 'planningCapacityPlan', route: 'capacity-plans', group: 'Capacity Planning', event: 'CAPACITY_PLAN_CREATED' },
  { entity: 'capacityScenario', model: 'CapacityScenario', delegate: 'capacityScenario', route: 'capacity-scenarios', group: 'Capacity Planning', event: 'CAPACITY_PLAN_CREATED' },
  { entity: 'capacityConstraint', model: 'CapacityConstraint', delegate: 'capacityConstraint', route: 'capacity-constraints', group: 'Capacity Planning', event: 'CAPACITY_PLAN_CREATED' },
  { entity: 'capacityForecastSignal', model: 'CapacityForecastSignal', delegate: 'capacityForecastSignal', route: 'capacity-forecast-signals', group: 'Capacity Planning', event: 'CAPACITY_PLAN_CREATED' },
  { entity: 'planningBudgetPlan', model: 'PlanningBudgetPlan', delegate: 'planningBudgetPlan', route: 'budget-plans', group: 'Budget Planning', event: 'BUDGET_PLAN_CREATED' },
  { entity: 'budgetLineItem', model: 'BudgetLineItem', delegate: 'budgetLineItem', route: 'budget-line-items', group: 'Budget Planning', event: 'BUDGET_PLAN_CREATED' },
  { entity: 'budgetScenario', model: 'BudgetScenario', delegate: 'budgetScenario', route: 'budget-scenarios', group: 'Budget Planning', event: 'BUDGET_PLAN_CREATED' },
  { entity: 'budgetVariance', model: 'BudgetVariance', delegate: 'budgetVariance', route: 'budget-variances', group: 'Budget Planning', event: 'BUDGET_VARIANCE_DETECTED' },
  { entity: 'planningScenario', model: 'PlanningScenario', delegate: 'planningScenario', route: 'scenarios', group: 'Scenario Modeling', event: 'SCENARIO_MODEL_CREATED' },
  { entity: 'scenarioAssumption', model: 'ScenarioAssumption', delegate: 'scenarioAssumption', route: 'scenario-assumptions', group: 'Scenario Modeling', event: 'SCENARIO_MODEL_CREATED' },
  { entity: 'scenarioSimulation', model: 'ScenarioSimulation', delegate: 'scenarioSimulation', route: 'scenario-simulations', group: 'Scenario Modeling', event: 'SCENARIO_SIMULATED' },
  { entity: 'scenarioDecision', model: 'ScenarioDecision', delegate: 'scenarioDecision', route: 'scenario-decisions', group: 'Scenario Modeling', event: 'SCENARIO_SIMULATED' },
  { entity: 'planningExecutiveDashboard', model: 'PlanningExecutiveDashboard', delegate: 'planningExecutiveDashboard', route: 'dashboards', group: 'Executive Dashboards', event: 'EXECUTIVE_PLANNING_DASHBOARD_CREATED' },
  { entity: 'executiveScorecard', model: 'ExecutiveScorecard', delegate: 'executiveScorecard', route: 'scorecards', group: 'Executive Dashboards', event: 'EXECUTIVE_PLANNING_DASHBOARD_CREATED' },
  { entity: 'portfolioMetric', model: 'PortfolioMetric', delegate: 'portfolioMetric', route: 'metrics', group: 'Portfolio Analytics', event: 'PORTFOLIO_ANALYTICS_GENERATED' },
  { entity: 'portfolioAnalyticsSnapshot', model: 'PortfolioAnalyticsSnapshot', delegate: 'portfolioAnalyticsSnapshot', route: 'analytics-snapshots', group: 'Portfolio Analytics', event: 'PORTFOLIO_ANALYTICS_GENERATED' },
  { entity: 'portfolioHealthScore', model: 'PortfolioHealthScore', delegate: 'portfolioHealthScore', route: 'health-scores', group: 'Portfolio Analytics', event: 'PORTFOLIO_ANALYTICS_GENERATED' },
  { entity: 'strategyCopilotQuery', model: 'StrategyCopilotQuery', delegate: 'strategyCopilotQuery', route: 'queries', group: 'AI Strategy Copilot', event: 'STRATEGY_COPILOT_QUERIED' },
  { entity: 'strategyRecommendation', model: 'StrategyRecommendation', delegate: 'strategyRecommendation', route: 'recommendations', group: 'AI Strategy Copilot', event: 'STRATEGY_RECOMMENDATION_CREATED' },
  { entity: 'strategicRiskSignal', model: 'StrategicRiskSignal', delegate: 'strategicRiskSignal', route: 'risk-signals', group: 'AI Strategy Copilot', event: 'STRATEGIC_RISK_DETECTED' },
  { entity: 'planningAuditEvent', model: 'PlanningAuditEvent', delegate: 'planningAuditEvent', route: 'audit-events', group: 'AI Strategy Copilot', event: 'PLANNING_AUDIT_RECORDED' },
];

export const PLANNING_GROUPS = {
  'OKR Management': { apiGroup: '/v1/okrs', entities: PLANNING_ENTITIES.filter((entity) => entity.group === 'OKR Management') },
  'Strategic Planning': { apiGroup: '/v1/strategic-planning', entities: PLANNING_ENTITIES.filter((entity) => entity.group === 'Strategic Planning') },
  'Portfolio Management': { apiGroup: '/v1/portfolios', entities: PLANNING_ENTITIES.filter((entity) => entity.group === 'Portfolio Management') },
  'Resource Planning': { apiGroup: '/v1/resource-planning', entities: PLANNING_ENTITIES.filter((entity) => entity.group === 'Resource Planning') },
  'Capacity Planning': { apiGroup: '/v1/capacity-planning', entities: PLANNING_ENTITIES.filter((entity) => entity.group === 'Capacity Planning') },
  'Budget Planning': { apiGroup: '/v1/budget-planning', entities: PLANNING_ENTITIES.filter((entity) => entity.group === 'Budget Planning') },
  'Scenario Modeling': { apiGroup: '/v1/scenario-modeling', entities: PLANNING_ENTITIES.filter((entity) => entity.group === 'Scenario Modeling') },
  'Executive Dashboards': { apiGroup: '/v1/executive-planning-dashboards', entities: PLANNING_ENTITIES.filter((entity) => entity.group === 'Executive Dashboards') },
  'Portfolio Analytics': { apiGroup: '/v1/portfolio-analytics', entities: PLANNING_ENTITIES.filter((entity) => entity.group === 'Portfolio Analytics') },
  'AI Strategy Copilot': { apiGroup: '/v1/ai-strategy-copilot', entities: PLANNING_ENTITIES.filter((entity) => entity.group === 'AI Strategy Copilot') },
} as const;

export function getPlanningEntity(entity: PlanningEntity) {
  const definition = PLANNING_ENTITIES.find((item) => item.entity === entity);
  if (!definition) throw new Error('Unknown planning entity: ' + entity);
  return definition;
}
