import type {
  DigitalTwinRoute,
  ForecastSignal,
  MarketExpansionModel,
  PlanningSignal,
  ResourceAllocation,
  RevenueSimulation,
  RiskSignal,
  ScenarioCase,
  SimulationScenario,
  StrategyCopilotCommand,
  TwinEntity,
} from '@/types/enterprise-digital-twin';

export const twinEntities: TwinEntity[] = [
  { id: 'organization', entity: 'Organization', signal: 'Org structure, business units, regions and strategic accounts', synchronization: 96, insight: 'The organizational model links strategy owners to goals and operational KPIs.', status: 'healthy' },
  { id: 'workforce', entity: 'Workforce', signal: 'Employees, hiring plans, skills, capacity and retention risk', synchronization: 91, insight: 'Workforce signals show where hiring plans and resource planning should change.', status: 'healthy' },
  { id: 'revenue', entity: 'Revenue', signal: 'MRR, ARR, expansion revenue, enterprise contracts and forecasts', synchronization: 94, insight: 'Revenue simulation can stress test expansion paths and contract timing.', status: 'accelerating' },
  { id: 'customers', entity: 'Customers', signal: 'Health, churn, adoption, journeys, support and success plans', synchronization: 89, insight: 'Customer growth and churn signals feed forecast and risk simulations.', status: 'watch' },
  { id: 'operations', entity: 'Operations', signal: 'Workflows, service health, fulfillment, procurement and process bottlenecks', synchronization: 87, insight: 'Operations modeling reveals process constraints before they become execution risks.', status: 'watch' },
  { id: 'projects', entity: 'Projects', signal: 'Portfolios, OKRs, milestones, dependencies and delivery confidence', synchronization: 90, insight: 'Portfolio planning connects project spend to strategic outcomes.', status: 'healthy' },
  { id: 'assets', entity: 'Assets', signal: 'Facilities, equipment, infrastructure and utilization', synchronization: 84, insight: 'Asset and infrastructure modeling improves resource allocation scenarios.', status: 'watch' },
  { id: 'financial-systems', entity: 'Financial Systems', signal: 'Budgets, expenses, cash flow, invoices and profitability', synchronization: 93, insight: 'Finance signals power profitability, budget adjustment and board-level planning.', status: 'healthy' },
];

export const simulationScenarios: SimulationScenario[] = [
  { id: 'growth', scenario: 'Growth Scenarios', input: 'Increase AI Enterprise adoption by 18% across strategic accounts.', projectedImpact: '+$1.4M ARR with moderate delivery pressure.', confidence: '91%', status: 'accelerating' },
  { id: 'revenue-change', scenario: 'Revenue Changes', input: 'Move enterprise discounting down by 3 points while improving success coverage.', projectedImpact: '+7.2% gross revenue retention and better expansion margin.', confidence: '86%', status: 'healthy' },
  { id: 'hiring', scenario: 'Hiring Plans', input: 'Add success engineering and implementation capacity for global regions.', projectedImpact: 'Reduces onboarding bottlenecks and improves time to value.', confidence: '82%', status: 'healthy' },
  { id: 'budget', scenario: 'Budget Adjustments', input: 'Shift 8% of operational budget into automation and self-service enablement.', projectedImpact: 'Improves support throughput and reduces manual operating cost.', confidence: '84%', status: 'healthy' },
  { id: 'product-launch', scenario: 'Product Launches', input: 'Launch enterprise digital twin as premium AI Enterprise capability.', projectedImpact: 'Creates board-level differentiation and strategic account expansion.', confidence: '88%', status: 'accelerating' },
  { id: 'market-expansion', scenario: 'Market Expansion', input: 'Expand into EU, GCC and Southeast Asia enterprise segments.', projectedImpact: 'High upside with compliance, localization and partner readiness dependencies.', confidence: '80%', status: 'watch' },
];

export const planningSignals: PlanningSignal[] = [
  { id: 'annual', plan: 'Annual Planning', horizon: '12 months', decisionSupport: 'Creates board-level roadmap from revenue, workforce, market and capacity simulations.', owner: 'Executive Strategy Copilot', status: 'healthy' },
  { id: 'quarterly', plan: 'Quarterly Planning', horizon: '90 days', decisionSupport: 'Turns scenario intelligence into execution priorities and measurable milestones.', owner: 'AI Strategy Planner', status: 'accelerating' },
  { id: 'okr', plan: 'OKR Planning', horizon: 'Quarterly objective cycle', decisionSupport: 'Links OKRs to modeled outcomes, forecast drivers and resource constraints.', owner: 'Portfolio leadership', status: 'healthy' },
  { id: 'portfolio', plan: 'Portfolio Planning', horizon: 'Strategic portfolio window', decisionSupport: 'Ranks initiatives by simulated value, risk, capacity and strategic fit.', owner: 'Transformation office', status: 'healthy' },
  { id: 'resource', plan: 'Resource Planning', horizon: 'Capacity planning cycle', decisionSupport: 'Optimizes teams, budget, infrastructure and project capacity.', owner: 'Operations leadership', status: 'watch' },
];

export const scenarioCases: ScenarioCase[] = [
  { id: 'best', caseName: 'Best Case', assumptions: 'High enterprise adoption, strong expansion revenue and controlled delivery cost.', businessImpact: '+42% ARR growth with improved executive account penetration.', action: 'Accelerate AI Enterprise rollout and partner-led market expansion.', status: 'accelerating' },
  { id: 'expected', caseName: 'Expected Case', assumptions: 'Stable conversion, moderate hiring, healthy retention and planned market entry.', businessImpact: '+27% ARR growth with manageable capacity pressure.', action: 'Maintain growth plan and monitor regional readiness gates.', status: 'healthy' },
  { id: 'worst', caseName: 'Worst Case', assumptions: 'Delayed compliance approvals, churn increase and hiring constraints.', businessImpact: '+11% ARR growth with elevated execution risk.', action: 'Prioritize retention, compliance remediation and phased expansion.', status: 'watch' },
];

export const forecastSignals: ForecastSignal[] = [
  { id: 'revenue', metric: 'Revenue', current: '$3.43M ARR', forecast: '$5.2M ARR projected', driver: 'Enterprise expansion, AI usage and marketplace adoption.', status: 'accelerating' },
  { id: 'profitability', metric: 'Profitability', current: '18% operating margin', forecast: '24% modeled margin', driver: 'Automation, cost controls and higher enterprise contract mix.', status: 'healthy' },
  { id: 'customer-growth', metric: 'Customer Growth', current: '412 active organizations', forecast: '610 organizations projected', driver: 'Trial conversion, partner programs and market expansion.', status: 'healthy' },
  { id: 'team-expansion', metric: 'Team Expansion', current: '142 core operators', forecast: '188 modeled headcount', driver: 'Implementation, success and AI operations capacity.', status: 'watch' },
  { id: 'market-share', metric: 'Market Share', current: 'Emerging enterprise AI OS category', forecast: 'Category leadership opportunity', driver: 'Digital twin, autonomous execution and marketplace differentiation.', status: 'accelerating' },
];

export const riskSignals: RiskSignal[] = [
  { id: 'financial', risk: 'Financial Risk', exposure: 'Budget pressure from rapid region and implementation expansion.', mitigation: 'Gate expansion spend against ARR confidence and cash flow simulations.', owner: 'CFO Advisor', status: 'watch' },
  { id: 'operational', risk: 'Operational Risk', exposure: 'Implementation capacity may lag strategic account growth.', mitigation: 'Shift capacity through agent automation and partner enablement.', owner: 'COO Advisor', status: 'watch' },
  { id: 'compliance', risk: 'Compliance Risk', exposure: 'Regional requirements can delay new country launch timing.', mitigation: 'Use trust, residency and compliance controls as expansion gates.', owner: 'Security and compliance leadership', status: 'watch' },
  { id: 'workforce', risk: 'Workforce Risk', exposure: 'Hiring gaps in success engineering and AI operations.', mitigation: 'Prioritize critical roles and automate repeatable customer success workflows.', owner: 'People leadership', status: 'healthy' },
  { id: 'vendor', risk: 'Vendor Risk', exposure: 'Cloud, AI provider and integration dependency concentration.', mitigation: 'Use multi-provider strategy, failover readiness and vendor risk monitoring.', owner: 'CTO Advisor', status: 'healthy' },
];

export const resourceAllocations: ResourceAllocation[] = [
  { id: 'teams', resource: 'Teams', currentAllocation: 'Growth-heavy staffing', optimizedAllocation: 'Balanced success, AI operations and implementation pods', expectedOutcome: 'Improves time to value and protects retention.', status: 'healthy' },
  { id: 'budget', resource: 'Budget', currentAllocation: 'Broad launch investment', optimizedAllocation: 'Scenario-based allocation to expansion, automation and compliance gates', expectedOutcome: 'Raises return on strategic spend.', status: 'accelerating' },
  { id: 'infrastructure', resource: 'Infrastructure', currentAllocation: 'Single operating baseline', optimizedAllocation: 'Region-aware capacity with cost and performance guardrails', expectedOutcome: 'Prepares global scale without waste.', status: 'healthy' },
  { id: 'projects', resource: 'Projects', currentAllocation: 'Parallel roadmap execution', optimizedAllocation: 'Portfolio-ranked initiatives by simulated impact and risk', expectedOutcome: 'Keeps execution focused on highest-value outcomes.', status: 'watch' },
];

export const revenueSimulations: RevenueSimulation[] = [
  { id: 'mrr', revenueType: 'MRR', baseCase: '$286k', simulatedCase: '$378k with AI Enterprise packaging', recommendation: 'Prioritize high-adoption customers for AI Enterprise upgrades.', status: 'accelerating' },
  { id: 'arr', revenueType: 'ARR', baseCase: '$3.43M', simulatedCase: '$5.2M expected case', recommendation: 'Use strategic account expansion and market entry as primary ARR levers.', status: 'healthy' },
  { id: 'expansion-revenue', revenueType: 'Expansion Revenue', baseCase: '$420k', simulatedCase: '$1.1M with executive sponsor coverage', recommendation: 'Pair customer success plans with executive digital twin briefings.', status: 'accelerating' },
  { id: 'contracts', revenueType: 'Enterprise Contracts', baseCase: '38 active contracts', simulatedCase: '64 modeled contracts', recommendation: 'Add board-level insight reports to enterprise renewal motions.', status: 'healthy' },
];

export const marketExpansionModels: MarketExpansionModel[] = [
  { id: 'countries', market: 'New Countries', readiness: '86%', opportunity: 'GCC and EU enterprise AI OS demand is strong.', risk: 'Compliance and data residency sequencing required.', status: 'watch' },
  { id: 'regions', market: 'New Regions', readiness: '89%', opportunity: 'Regional partner ecosystem can speed implementation.', risk: 'Support coverage and localized onboarding must mature.', status: 'healthy' },
  { id: 'industries', market: 'New Industries', readiness: '82%', opportunity: 'Manufacturing, finance and healthcare are high-value verticals.', risk: 'Industry templates need deeper compliance and workflow tuning.', status: 'watch' },
  { id: 'segments', market: 'New Customer Segments', readiness: '91%', opportunity: 'AI Enterprise and executive planning segments show premium willingness.', risk: 'Messaging must stay clear and outcome-driven.', status: 'healthy' },
];

export const strategyCopilotCommands: StrategyCopilotCommand[] = [
  { id: 'strategic-plan', command: 'Create strategic plan', response: 'Generate annual and quarterly strategic plans from digital twin simulations, OKRs, budget, workforce and market assumptions.' },
  { id: 'simulation', command: 'Run business simulation', response: 'Compare growth, revenue, hiring, budget, product launch and market expansion simulations.' },
  { id: 'revenue', command: 'Predict revenue', response: 'Forecast MRR, ARR, expansion revenue and enterprise contracts with confidence and assumptions.' },
  { id: 'risk', command: 'Evaluate risk', response: 'Evaluate financial, operational, compliance, workforce and vendor risk with mitigation owners.' },
  { id: 'expansion', command: 'Recommend expansion strategy', response: 'Rank new countries, regions, industries and customer segments by readiness, opportunity and risk.' },
  { id: 'board', command: 'Generate board-level insights', response: 'Summarize best case, expected case, worst case, strategic tradeoffs and recommended board actions.' },
];

export const digitalTwinNavigation = [
  { group: 'Twin', items: ['Digital Twin Engine', 'Business Simulation', 'Scenario Intelligence'] },
  { group: 'Planning', items: ['Strategic Planning', 'Forecast Simulation', 'Resource Allocation'] },
  { group: 'Growth', items: ['Revenue Simulation', 'Market Expansion', 'Executive Strategy Copilot'] },
  { group: 'Risk', items: ['Risk Simulation', 'Board-Level Insights'] },
];

export const phase68Routes: DigitalTwinRoute[] = [
  {
    "path": "/enterprise-digital-twin",
    "module": "Enterprise Digital Twin Workspace",
    "marker": "Organization"
  },
  {
    "path": "/enterprise-digital-twin/digital-twin-engine",
    "module": "Enterprise Digital Twin Engine",
    "marker": "Financial Systems"
  },
  {
    "path": "/enterprise-digital-twin/business-simulation",
    "module": "Business Simulation Center",
    "marker": "Growth Scenarios"
  },
  {
    "path": "/enterprise-digital-twin/strategic-planning",
    "module": "Strategic Planning Workspace",
    "marker": "Annual Planning"
  },
  {
    "path": "/enterprise-digital-twin/scenario-intelligence",
    "module": "Scenario Intelligence Engine",
    "marker": "Best Case"
  },
  {
    "path": "/enterprise-digital-twin/forecast-simulation",
    "module": "Forecast Simulation Platform",
    "marker": "Profitability"
  },
  {
    "path": "/enterprise-digital-twin/risk-simulation",
    "module": "Risk Simulation Center",
    "marker": "Compliance Risk"
  },
  {
    "path": "/enterprise-digital-twin/resource-allocation",
    "module": "Resource Allocation Simulator",
    "marker": "Infrastructure"
  },
  {
    "path": "/enterprise-digital-twin/revenue-simulation",
    "module": "Revenue Simulation Engine",
    "marker": "Expansion Revenue"
  },
  {
    "path": "/enterprise-digital-twin/market-expansion",
    "module": "Market Expansion Simulator",
    "marker": "New Countries"
  },
  {
    "path": "/enterprise-digital-twin/executive-strategy-copilot",
    "module": "Executive Strategy Copilot",
    "marker": "Create strategic plan"
  },
  {
    "path": "/workspace/enterprise-digital-twin",
    "module": "Enterprise Digital Twin compatibility route",
    "marker": "Organization"
  }
];
