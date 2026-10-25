import type {
  AgentNetworkSignal,
  CoordinationSignal,
  EcosystemSignal,
  EnterpriseAgiCapability,
  EnterpriseAgiRoute,
  EnterpriseContextSignal,
  ExecutiveAgiCommand,
  IntelligenceFabricConnection,
  KnowledgeGraphRelation,
  OrganizationalIntelligenceMetric,
  StrategicCoordinationSignal,
} from '@/types/enterprise-agi';

export const enterpriseAgiCapabilities: EnterpriseAgiCapability[] = [
  { id: 'enterprise-reasoning', capability: 'Enterprise-wide reasoning', domain: 'Enterprise AGI Core', businessSignal: 'Combines revenue, workforce, operations, customer and risk context into one reasoning surface.', governanceControl: 'Every recommendation preserves tenant scope, RBAC context, audit evidence and approval sensitivity.', outcome: 'Executives can ask for a complete business position without manually stitching modules together.', status: 'healthy' },
  { id: 'multi-domain', capability: 'Multi-domain intelligence', domain: 'Unified Intelligence Fabric', businessSignal: 'Reads CRM, Finance, HR, Projects, Inventory, Marketing, Customer Success, Analytics and AI Agents as connected signals.', governanceControl: 'Module boundaries remain permission-aware and workspace-scoped.', outcome: 'Business intelligence becomes cross-functional instead of isolated by department.', status: 'coordinating' },
  { id: 'strategic-planning', capability: 'Strategic planning', domain: 'Executive AGI Workspace', businessSignal: 'Turns goals, forecasts, risks and operating constraints into strategic plans.', governanceControl: 'Plans include confidence, dependencies, owners and decision evidence.', outcome: 'Planning cycles become faster and better grounded in operational facts.', status: 'optimizing' },
  { id: 'business-understanding', capability: 'Business understanding', domain: 'Enterprise Context Engine', businessSignal: 'Keeps business history, operating model, org design and strategic context available to AGI execution.', governanceControl: 'Context assembly filters sensitive records according to workspace policy.', outcome: 'NEXORA understands why actions matter, not only which records changed.', status: 'healthy' },
  { id: 'goal-orchestration', capability: 'Goal orchestration', domain: 'Strategic Coordination Hub', businessSignal: 'Connects enterprise objectives to initiatives, workflows, teams, KPIs and agents.', governanceControl: 'Goal changes are tracked as strategic decisions with evidence.', outcome: 'Execution aligns to objectives with visible progress and accountability.', status: 'coordinating' },
];

export const intelligenceFabricConnections: IntelligenceFabricConnection[] = [
  { id: 'crm', module: 'CRM', connectedContext: 'Pipeline, accounts, opportunities and customer timelines.', sharedSignal: 'Revenue quality, customer risk and sales velocity feed enterprise reasoning.', coordinationAction: 'Route hot accounts, expansion opportunities and churn risks to the right agents.', status: 'healthy' },
  { id: 'finance', module: 'Finance', connectedContext: 'Revenue, invoices, expenses, budgets, forecasts and cash position.', sharedSignal: 'Financial constraints shape strategic plans and autonomous recommendations.', coordinationAction: 'Coordinate budget-aware workflows and risk-based approvals.', status: 'healthy' },
  { id: 'hr', module: 'HR', connectedContext: 'Employees, skills, teams, hiring plans, attendance and performance.', sharedSignal: 'Workforce capacity and talent signals influence execution planning.', coordinationAction: 'Align hiring, skill development and team capacity to strategic objectives.', status: 'coordinating' },
  { id: 'projects', module: 'Projects', connectedContext: 'Project health, tasks, blockers, ownership and delivery timelines.', sharedSignal: 'Execution progress and blockers drive organizational alignment.', coordinationAction: 'Synchronize project recovery, resource allocation and executive escalation.', status: 'watch' },
  { id: 'inventory', module: 'Inventory', connectedContext: 'Stock, fulfillment, replenishment, demand and supply chain risk.', sharedSignal: 'Operational constraints influence revenue plans and customer commitments.', coordinationAction: 'Coordinate supply chain recommendations with finance and customer success.', status: 'coordinating' },
  { id: 'marketing', module: 'Marketing', connectedContext: 'Campaigns, acquisition, segments, positioning and demand creation.', sharedSignal: 'Growth opportunities connect marketing motion to sales and revenue outcomes.', coordinationAction: 'Recommend campaign focus based on pipeline, market and retention signals.', status: 'healthy' },
  { id: 'customer-success', module: 'Customer Success', connectedContext: 'Health scores, adoption, renewals, escalations and expansion signals.', sharedSignal: 'Customer risk and opportunity shape enterprise priorities.', coordinationAction: 'Coordinate renewal, support, product and executive interventions.', status: 'healthy' },
  { id: 'analytics', module: 'Analytics', connectedContext: 'KPIs, trends, dashboards, forecasts and strategic insights.', sharedSignal: 'Measurement evidence grounds every AGI recommendation.', coordinationAction: 'Publish metric-backed explanations and board-ready summaries.', status: 'optimizing' },
  { id: 'ai-agents', module: 'AI Agents', connectedContext: 'Agent capabilities, executions, approvals, memory and outcomes.', sharedSignal: 'Agent performance controls autonomous execution safety.', coordinationAction: 'Coordinate multi-agent execution through shared memory and approval policies.', status: 'coordinating' },
];

export const coordinationSignals: CoordinationSignal[] = [
  { id: 'workflow-sync', capability: 'Workflow synchronization', source: 'Workflows, agents, projects and approvals', synchronization: 'Maps dependencies across workflows, owners and business outcomes.', enterpriseOutcome: 'Teams coordinate execution without losing context between modules.', status: 'coordinating' },
  { id: 'shared-context', capability: 'Shared context', source: 'Knowledge graph, memory, analytics and business history', synchronization: 'Publishes reusable context snapshots for AGI, copilots and agents.', enterpriseOutcome: 'Decisions remain consistent because every surface uses the same business context.', status: 'healthy' },
  { id: 'cross-domain-execution', capability: 'Cross-domain execution', source: 'CRM, Finance, HR, Projects, Inventory and Customer Success', synchronization: 'Creates execution plans that span departments and systems.', enterpriseOutcome: 'NEXORA can coordinate action across the whole operating system.', status: 'optimizing' },
  { id: 'organizational-alignment', capability: 'Organizational alignment', source: 'Objectives, KPIs, initiatives and leadership decisions', synchronization: 'Connects work to strategic objectives and visible ownership.', enterpriseOutcome: 'Execution lines up with leadership strategy and measurable outcomes.', status: 'healthy' },
];

export const knowledgeGraphRelations: KnowledgeGraphRelation[] = [
  { id: 'customers', entity: 'Customers', relationship: 'Customers connect to opportunities, contracts, invoices, projects, support work and success plans.', insight: 'Customer relationships explain revenue quality, churn exposure and expansion potential.', action: 'Prioritize at-risk and high-value accounts with coordinated agent support.', status: 'healthy' },
  { id: 'employees', entity: 'Employees', relationship: 'Employees connect to departments, projects, skills, goals, reviews and execution ownership.', insight: 'Workforce structure explains capacity, productivity and delivery risk.', action: 'Recommend staffing, enablement and leadership actions for strategic priorities.', status: 'coordinating' },
  { id: 'vendors', entity: 'Vendors', relationship: 'Vendors connect to spend, contracts, procurement, delivery risk and operational dependencies.', insight: 'Vendor relationships expose cost, resilience and compliance pressure.', action: 'Coordinate procurement, finance and operations remediation.', status: 'watch' },
  { id: 'assets', entity: 'Assets', relationship: 'Assets connect to maintenance, field service, manufacturing, operations and financial depreciation.', insight: 'Asset health explains operational continuity and cost exposure.', action: 'Recommend preventive action and budget allocation where risk rises.', status: 'healthy' },
  { id: 'projects', entity: 'Projects', relationship: 'Projects connect to objectives, budgets, teams, tasks, workflows and customer commitments.', insight: 'Project state shows strategic execution reality.', action: 'Escalate blockers and coordinate resources for high-impact initiatives.', status: 'coordinating' },
  { id: 'revenue', entity: 'Revenue', relationship: 'Revenue connects to customers, products, contracts, invoices, renewals, forecasts and cash flow.', insight: 'Revenue relationships reveal growth, retention and risk drivers.', action: 'Generate board-ready revenue explanations and next actions.', status: 'optimizing' },
  { id: 'operations', entity: 'Operations', relationship: 'Operations connect to workflows, incidents, service levels, supply chain, fulfillment and automation.', insight: 'Operational relationships reveal bottlenecks and automation opportunities.', action: 'Coordinate recovery, optimization and continuous improvement.', status: 'coordinating' },
];

export const ecosystemSignals: EcosystemSignal[] = [
  { id: 'ai-collaboration', capability: 'AI-driven collaboration', orchestration: 'Agents, copilots and humans share objectives, context and approval paths.', intelligence: 'Collaboration is prioritized by strategic impact and operating risk.', businessImpact: 'Teams move faster while staying inside governance controls.', status: 'healthy' },
  { id: 'business-process', capability: 'Business process orchestration', orchestration: 'Cross-module processes are composed from workflows, events, agents and policy.', intelligence: 'The AGI layer identifies which process should coordinate next.', businessImpact: 'Operating rhythms become self-coordinating instead of manually scheduled.', status: 'coordinating' },
  { id: 'org-intelligence', capability: 'Organizational intelligence', orchestration: 'Performance, productivity, growth, risk and opportunities are connected to execution.', intelligence: 'Organizational patterns reveal where strategy needs intervention.', businessImpact: 'Executives get a living model of how the company is functioning.', status: 'optimizing' },
  { id: 'enterprise-automation', capability: 'Enterprise automation', orchestration: 'Automations can be recommended, queued, approved and tracked across modules.', intelligence: 'Automation ideas are ranked by ROI, safety and execution readiness.', businessImpact: 'NEXORA steadily improves the operating system with measurable savings.', status: 'healthy' },
];

export const agentNetworkSignals: AgentNetworkSignal[] = [
  { id: 'agent-hierarchy', capability: 'Agent hierarchy', commandPattern: 'Executive agents set goals, domain agents plan actions and specialist agents execute controlled tasks.', sharedMemory: 'Agents read approved context, outcomes and prior decisions.', executionGuardrail: 'Hierarchy does not override RBAC or approval thresholds.', status: 'healthy' },
  { id: 'agent-coordination', capability: 'Agent coordination', commandPattern: 'Agents coordinate revenue, finance, people, operations and customer success actions.', sharedMemory: 'Shared memory captures handoffs, assumptions and business evidence.', executionGuardrail: 'Coordination produces proposed actions before material execution.', status: 'coordinating' },
  { id: 'agent-communication', capability: 'Agent communication', commandPattern: 'Agents exchange structured messages with intent, context, confidence and requested action.', sharedMemory: 'Messages can be audited and reused for future decision quality.', executionGuardrail: 'Sensitive context is filtered before cross-agent exchange.', status: 'healthy' },
  { id: 'shared-memory', capability: 'Shared memory', commandPattern: 'Long-running enterprise goals reuse relevant context from prior decisions and outcomes.', sharedMemory: 'Memory is scoped by tenant, workspace, department and permission.', executionGuardrail: 'Memory access remains traceable and revocable.', status: 'watch' },
  { id: 'collective-execution', capability: 'Collective execution', commandPattern: 'Agent teams collaborate on goals, divide work and track outcomes together.', sharedMemory: 'Outcome learning updates future recommendations and risk scoring.', executionGuardrail: 'High-impact execution requires approval and rollback plan.', status: 'optimizing' },
];

export const enterpriseContextSignals: EnterpriseContextSignal[] = [
  { id: 'organizational-memory', context: 'Organizational memory', source: 'Decisions, goals, strategy reviews, operating history and previous outcomes.', memoryUse: 'Builds continuity across executive planning and autonomous recommendations.', decisionValue: 'NEXORA remembers what the company has already tried and why it worked or failed.', status: 'healthy' },
  { id: 'business-history', context: 'Business history', source: 'Revenue shifts, customer transitions, hiring changes, incidents and workflow outcomes.', memoryUse: 'Explains present state with historical evidence.', decisionValue: 'Executives can evaluate recommendations against business trajectory.', status: 'healthy' },
  { id: 'strategic-context', context: 'Strategic context', source: 'Objectives, initiatives, board priorities, scenarios and forecasts.', memoryUse: 'Anchors recommendations to what leadership is trying to achieve.', decisionValue: 'Autonomous actions stay pointed at strategic goals.', status: 'coordinating' },
  { id: 'operational-context', context: 'Operational context', source: 'Workflow health, project state, service queues, inventory signals and incident patterns.', memoryUse: 'Turns operational telemetry into decision-ready context.', decisionValue: 'The AGI layer can distinguish noise from operational risk.', status: 'optimizing' },
];

export const organizationalMetrics: OrganizationalIntelligenceMetric[] = [
  { id: 'performance', metric: 'Performance', value: '92 enterprise health', insight: 'Performance is strongest where goals, owners and workflow outcomes are connected.', recommendation: 'Use the coordination hub to keep every strategic initiative tied to measurable KPIs.', status: 'healthy' },
  { id: 'productivity', metric: 'Productivity', value: '18% automation leverage', insight: 'Productivity improves when repeatable cross-module handoffs are converted into agent-assisted workflows.', recommendation: 'Expand automation on finance approvals, customer follow-ups and project recovery loops.', status: 'optimizing' },
  { id: 'growth', metric: 'Growth', value: '+14% strategic momentum', insight: 'Growth opportunities appear in expansion revenue, market fit, usage depth and customer health.', recommendation: 'Coordinate CRM, customer success and finance agents around high-confidence expansion accounts.', status: 'healthy' },
  { id: 'risk', metric: 'Risk', value: '7 active enterprise watches', insight: 'Risk is concentrated in vendor dependency, workflow bottlenecks and resource constraints.', recommendation: 'Run executive review on risk simulations and assign recovery owners.', status: 'watch' },
  { id: 'opportunities', metric: 'Opportunities', value: '23 coordinated actions', insight: 'Opportunities improve when knowledge graph relationships reveal cross-functional leverage.', recommendation: 'Create action plans for top opportunities with owner, impact and approval policy.', status: 'coordinating' },
];

export const executiveAgiCommands: ExecutiveAgiCommand[] = [
  { id: 'health', command: 'Show enterprise health', response: 'Summarize enterprise health across revenue, customers, people, operations, risk, workflows and AI agent performance.', evidence: 'Uses organizational intelligence, knowledge graph relationships and live module context.' },
  { id: 'growth', command: 'Recommend growth strategy', response: 'Generate a coordinated growth strategy with target accounts, product motions, hiring needs, budget impact and risk controls.', evidence: 'Uses CRM, Finance, Customer Success, Analytics and strategic context.' },
  { id: 'optimize', command: 'Optimize organization', response: 'Identify productivity bottlenecks, process constraints, team capacity risks and automation opportunities.', evidence: 'Uses HR, Projects, Operations, Workflows and Multi-Agent Command Network signals.' },
  { id: 'future-risks', command: 'Predict future risks', response: 'Predict revenue, workforce, customer, vendor, operational and compliance risks with mitigation options.', evidence: 'Uses forecasts, incident history, risk simulations and knowledge graph dependencies.' },
  { id: 'board-report', command: 'Generate board report', response: 'Create a board-level report with enterprise health, strategic priorities, risks, opportunities and recommended actions.', evidence: 'Uses executive scorecards, strategic coordination, KPI evidence and AGI recommendations.' },
  { id: 'coordinate-execution', command: 'Coordinate business execution', response: 'Translate strategy into initiatives, workflows, owners, agent tasks, approvals and progress tracking.', evidence: 'Uses Strategic Coordination Hub, workflow synchronization and shared context.' },
];

export const strategicCoordinationSignals: StrategicCoordinationSignal[] = [
  { id: 'objectives', objective: 'Enterprise objectives', initiative: 'Connect board goals, department plans and operating KPIs.', alignment: 'Every objective maps to owners, modules, metrics and execution lanes.', tracking: 'Track status, confidence, blockers, business impact and next action.', status: 'healthy' },
  { id: 'initiatives', objective: 'Strategic initiatives', initiative: 'Coordinate growth, retention, efficiency, resilience and market expansion programs.', alignment: 'Initiatives link to projects, workflows, agents and budgets.', tracking: 'Track milestone health, risk, dependencies and cross-team handoffs.', status: 'coordinating' },
  { id: 'alignment', objective: 'Organizational alignment', initiative: 'Align people, finance, operations and customer motions around strategy.', alignment: 'Alignment score uses goals, capacity, budget and delivery signals.', tracking: 'Highlight teams or initiatives drifting from strategic priorities.', status: 'watch' },
  { id: 'execution', objective: 'Execution tracking', initiative: 'Monitor execution progress through workflows, tasks, approvals and agent runs.', alignment: 'Execution evidence stays attached to objectives and decisions.', tracking: 'Report progress, blockers, next actions and predicted outcomes.', status: 'optimizing' },
];

export const enterpriseAgiNavigation = [
  { group: 'AGI Core', items: ['Enterprise AGI Core', 'Unified Intelligence Fabric', 'Enterprise Context Engine'] },
  { group: 'Coordination', items: ['Cross-Module Coordination', 'Strategic Coordination', 'Knowledge Graph'] },
  { group: 'Autonomy', items: ['Multi-Agent Command Network', 'Autonomous Business Ecosystem', 'Organizational Intelligence'] },
  { group: 'Executive', items: ['Executive AGI Workspace', 'Board Reports', 'Strategic Recommendations'] },
];

export const phase70Routes: EnterpriseAgiRoute[] = [
  {
    "path": "/enterprise-agi",
    "module": "Enterprise AGI Workspace",
    "marker": "Enterprise-wide reasoning"
  },
  {
    "path": "/enterprise-agi/core",
    "module": "Enterprise AGI Core",
    "marker": "Goal orchestration"
  },
  {
    "path": "/enterprise-agi/intelligence-fabric",
    "module": "Unified Intelligence Fabric",
    "marker": "CRM"
  },
  {
    "path": "/enterprise-agi/cross-module-coordination",
    "module": "Cross-Module Coordination Engine",
    "marker": "Workflow synchronization"
  },
  {
    "path": "/enterprise-agi/knowledge-graph",
    "module": "Enterprise Knowledge Graph",
    "marker": "Customers"
  },
  {
    "path": "/enterprise-agi/business-ecosystem",
    "module": "Autonomous Business Ecosystem",
    "marker": "AI-driven collaboration"
  },
  {
    "path": "/enterprise-agi/multi-agent-network",
    "module": "Multi-Agent Command Network",
    "marker": "Agent hierarchy"
  },
  {
    "path": "/enterprise-agi/context-engine",
    "module": "Enterprise Context Engine",
    "marker": "Organizational memory"
  },
  {
    "path": "/enterprise-agi/organizational-intelligence",
    "module": "Organizational Intelligence Layer",
    "marker": "Performance"
  },
  {
    "path": "/enterprise-agi/executive-workspace",
    "module": "Executive AGI Workspace",
    "marker": "Show enterprise health"
  },
  {
    "path": "/enterprise-agi/strategic-coordination",
    "module": "Strategic Coordination Hub",
    "marker": "Enterprise objectives"
  },
  {
    "path": "/workspace/enterprise-agi",
    "module": "Enterprise AGI compatibility route",
    "marker": "Enterprise-wide reasoning"
  }
];
