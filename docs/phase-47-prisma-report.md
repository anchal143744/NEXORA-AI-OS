# Phase 47 Prisma Report

## Models Added

- PlanningCycle mapped to planning_cycles
- OkrObjective mapped to okr_objectives
- OkrKeyResult mapped to okr_key_results
- OkrInitiative mapped to okr_initiatives
- OkrCheckIn mapped to okr_check_ins
- OkrAlignment mapped to okr_alignments
- EnterpriseStrategicPlan mapped to enterprise_strategic_plans
- StrategyPillar mapped to strategy_pillars
- StrategicTheme mapped to strategic_themes
- StrategyMilestone mapped to strategy_milestones
- EnterprisePortfolio mapped to enterprise_portfolios
- PortfolioProgram mapped to portfolio_programs
- PortfolioProject mapped to portfolio_projects
- PortfolioInvestment mapped to portfolio_investments
- PortfolioRisk mapped to portfolio_risks
- PortfolioDependency mapped to portfolio_dependencys
- PlanningResourcePool mapped to planning_resource_pools
- ResourceDemand mapped to resource_demands
- PortfolioResourceAllocation mapped to portfolio_resource_allocations
- ResourceSkillRequirement mapped to resource_skill_requirements
- PlanningCapacityPlan mapped to planning_capacity_plans
- CapacityScenario mapped to capacity_scenarios
- CapacityConstraint mapped to capacity_constraints
- CapacityForecastSignal mapped to capacity_forecast_signals
- PlanningBudgetPlan mapped to planning_budget_plans
- BudgetLineItem mapped to budget_line_items
- BudgetScenario mapped to budget_scenarios
- BudgetVariance mapped to budget_variances
- PlanningScenario mapped to planning_scenarios
- ScenarioAssumption mapped to scenario_assumptions
- ScenarioSimulation mapped to scenario_simulations
- ScenarioDecision mapped to scenario_decisions
- PlanningExecutiveDashboard mapped to planning_executive_dashboards
- ExecutiveScorecard mapped to executive_scorecards
- PortfolioMetric mapped to portfolio_metrics
- PortfolioAnalyticsSnapshot mapped to portfolio_analytics_snapshots
- PortfolioHealthScore mapped to portfolio_health_scores
- StrategyCopilotQuery mapped to strategy_copilot_querys
- StrategyRecommendation mapped to strategy_recommendations
- StrategicRiskSignal mapped to strategic_risk_signals
- PlanningAuditEvent mapped to planning_audit_events

## Model Count

- Previous total: 637.
- Added in Phase 47: 41.
- New total: 678.

## Index Strategy

Every model includes tenant/workspace indexes, tenant/status indexes, fiscal year filters, soft-delete indexes and strategic relationship indexes for cycles, plans, objectives, portfolios, programs, projects, owners, departments, risk and health.
