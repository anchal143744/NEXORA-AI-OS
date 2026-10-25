import type {
  AgentCollaborationSignal,
  AutonomousEnterpriseRoute,
  AutonomousMetric,
  ExecutiveAdvisorSignal,
  ExecutiveCopilotCommand,
  GoalAutomationSignal,
  KnowledgeReasoningSignal,
  OptimizationSignal,
  PredictionSignal,
  ReasoningCapability,
  SimulationScenario,
  StrategyPlanSignal,
} from '@/types/autonomous-enterprise';

export const autonomousMetrics: AutonomousMetric[] = [
  { id: 'enterprise-health', label: 'Enterprise Health', value: '91', detail: 'Composite health across revenue, customer success, operations, workforce, AI usage and global readiness.', status: 'healthy' },
  { id: 'strategic-recommendations', label: 'Strategic Recommendations', value: '18', detail: 'Executive-level recommendations prioritized by confidence, business impact and required approval.', status: 'accelerating' },
  { id: 'opportunity-detection', label: 'Opportunity Detection', value: '$1.2M', detail: 'Revenue, automation, expansion and efficiency opportunities surfaced by autonomous intelligence.', status: 'accelerating' },
  { id: 'risk-detection', label: 'Risk Detection', value: '7', detail: 'Revenue, churn, operational, capacity and compliance risks that need accountable follow-up.', status: 'watch' },
  { id: 'autonomous-insights', label: 'Autonomous Insights', value: '42', detail: 'AI-generated insights from growth, analytics, customer, finance, workflow and knowledge graph signals.', status: 'healthy' },
];

export const reasoningCapabilities: ReasoningCapability[] = [
  { id: 'cot', capability: 'Chain Of Thought Planning', mode: 'Private reasoning plan with executive-safe summaries', governance: 'Detailed internal reasoning is not exposed; decisions are summarized with evidence and risk.', outcome: 'Creates auditable multi-step plans without leaking sensitive reasoning traces.', status: 'healthy' },
  { id: 'decision-trees', capability: 'Multi Step Decision Trees', mode: 'Branching recommendations with confidence, cost and approval paths', governance: 'Every branch records assumptions, owner and rollback criteria.', outcome: 'Supports complex business decisions across finance, growth, people and operations.', status: 'healthy' },
  { id: 'scenario-analysis', capability: 'Scenario Analysis', mode: 'Compares base, aggressive, conservative and risk-adjusted business paths', governance: 'Scenario inputs are tenant-scoped and workspace-scoped.', outcome: 'Executives see clear tradeoffs before committing resources.', status: 'accelerating' },
  { id: 'strategic-reasoning', capability: 'Strategic Reasoning', mode: 'Connects goals, KPIs, forecasts and constraints', governance: 'Recommendations include confidence, evidence and approval level.', outcome: 'Moves NEXORA from reporting to guided enterprise strategy.', status: 'accelerating' },
  { id: 'business-logic', capability: 'Business Logic Reasoning', mode: 'Applies operating policies, permissions, workflows and domain rules', governance: 'RBAC and tenant isolation remain enforcement boundaries.', outcome: 'Turns intelligence into safe, actionable business automation.', status: 'healthy' },
];

export const agentCollaborationSignals: AgentCollaborationSignal[] = [
  { id: 'communication', network: 'Agent Communication', communication: 'Sales, Finance, Success and Operations agents exchange structured task context.', sharedMemory: 'Shared Memory keeps customer health, revenue, workflow and decision context aligned.', delegation: 'Task Delegation routes work to agent teams with role validation.', status: 'healthy' },
  { id: 'teams', network: 'Agent Teams', communication: 'Agents coordinate as executive, revenue, people, operations and support teams.', sharedMemory: 'Team memory keeps goal state and outcome history available.', delegation: 'Goal Coordination assigns owners, dependencies and approval gates.', status: 'accelerating' },
  { id: 'goals', network: 'Goal Coordination', communication: 'Agents negotiate priorities based on strategy, risk and capacity.', sharedMemory: 'Shared goal memory links KPIs, workstreams and recommendations.', delegation: 'Delegated tasks create action plans and monitoring checkpoints.', status: 'healthy' },
];

export const executiveAdvisorSignals: ExecutiveAdvisorSignal[] = [
  { id: 'ceo', advisor: 'CEO Advisor', focus: 'Enterprise strategy, growth, risk and execution velocity', recommendation: 'Prioritize strategic accounts, autonomous workflows and global readiness.', businessImpact: 'Keeps leadership aligned around growth and operating leverage.', status: 'accelerating' },
  { id: 'cfo', advisor: 'CFO Advisor', focus: 'Forecasting, cash, expansion revenue and budget control', recommendation: 'Simulate AI Enterprise expansion and cost optimization scenarios.', businessImpact: 'Improves capital allocation and forecast confidence.', status: 'healthy' },
  { id: 'coo', advisor: 'COO Advisor', focus: 'Operations, capacity, fulfillment, service and process health', recommendation: 'Target bottleneck automation in workflow, support and procurement operations.', businessImpact: 'Reduces operational drag and increases throughput.', status: 'watch' },
  { id: 'cro', advisor: 'CRO Advisor', focus: 'Pipeline, retention, expansion and customer health', recommendation: 'Launch renewal and expansion playbooks for high-value accounts.', businessImpact: 'Protects ARR and raises expansion conversion.', status: 'accelerating' },
  { id: 'cto', advisor: 'CTO Advisor', focus: 'Platform reliability, AI governance, integrations and security', recommendation: 'Harden model governance and autonomous action audit controls before wider rollout.', businessImpact: 'Keeps autonomy trustworthy at enterprise scale.', status: 'healthy' },
];

export const optimizationSignals: OptimizationSignal[] = [
  { id: 'bottlenecks', signal: 'Bottleneck Detection', area: 'Workflow approvals and support queues', recommendation: 'Split approval policies by risk level and auto-route low-risk tasks.', impact: 'Faster cycle time and fewer stalled workflows.', status: 'watch' },
  { id: 'process', signal: 'Process Improvement', area: 'Revenue operations handoffs', recommendation: 'Unify renewal, finance and success playbooks into one autonomous sequence.', impact: 'Higher expansion revenue and lower churn risk.', status: 'healthy' },
  { id: 'automation', signal: 'Automation Suggestions', area: 'Customer onboarding and reporting', recommendation: 'Let agents generate onboarding checkpoints and weekly executive summaries.', impact: 'Less manual reporting and faster customer activation.', status: 'accelerating' },
  { id: 'cost', signal: 'Cost Reduction Recommendations', area: 'Cloud usage and operational capacity', recommendation: 'Use FinOps signals to schedule workload optimization and capacity balancing.', impact: 'Lower operating cost without reducing service quality.', status: 'healthy' },
];

export const predictionSignals: PredictionSignal[] = [
  { id: 'revenue', prediction: 'Revenue', confidence: '92%', planningUse: 'Forecast ARR, MRR and expansion revenue using adoption, pipeline and usage signals.', status: 'healthy' },
  { id: 'churn', prediction: 'Churn', confidence: '88%', planningUse: 'Identify accounts with weak health, low usage depth and unresolved service risk.', status: 'watch' },
  { id: 'hiring', prediction: 'Hiring Needs', confidence: '84%', planningUse: 'Estimate hiring demand from growth plan, delivery capacity and workforce utilization.', status: 'healthy' },
  { id: 'capacity', prediction: 'Capacity Requirements', confidence: '87%', planningUse: 'Predict operational, infrastructure and team capacity needs before bottlenecks appear.', status: 'accelerating' },
  { id: 'operations', prediction: 'Operational Risks', confidence: '81%', planningUse: 'Surface process, compliance, reliability and service risks for executive review.', status: 'watch' },
];

export const simulationScenarios: SimulationScenario[] = [
  { id: 'what-if', scenario: 'What If Analysis', model: 'Compare current, accelerated and conservative operating plans.', result: 'AI Enterprise expansion has the highest upside with moderate delivery risk.', decision: 'Fund AI agent expansion and retention playbooks first.', status: 'accelerating' },
  { id: 'growth', scenario: 'Growth Scenarios', model: 'Model new enterprise customers, expansion and marketplace adoption.', result: 'Strategic accounts can lift ARR faster than broad low-touch acquisition.', decision: 'Assign executive sponsors to top 20 accounts.', status: 'healthy' },
  { id: 'budget', scenario: 'Budget Simulations', model: 'Shift budget between product, success, sales and infrastructure.', result: 'Customer success automation improves retention with lower incremental cost.', decision: 'Move budget into success automation and onboarding intelligence.', status: 'healthy' },
  { id: 'resource', scenario: 'Resource Simulations', model: 'Balance teams, AI agents and workflow automation capacity.', result: 'Agent delegation offsets support and operations capacity pressure.', decision: 'Deploy support and operations agent teams.', status: 'watch' },
  { id: 'risk', scenario: 'Risk Simulations', model: 'Stress test churn, downtime, cost spike and compliance delay scenarios.', result: 'Compliance and reliability risks require clear ownership before scale acceleration.', decision: 'Create autonomous risk review cadence.', status: 'watch' },
];

export const goalAutomationSignals: GoalAutomationSignal[] = [
  { id: 'assignment', goal: 'Goal Assignment', owner: 'Executive sponsor plus agent team', actionPlan: 'Assign revenue, retention, automation and reliability goals to owners.', progress: '82%', status: 'healthy' },
  { id: 'monitoring', goal: 'Goal Monitoring', owner: 'Strategy Planner', actionPlan: 'Track goal movement against KPIs, risks, capacity and forecast deltas.', progress: '76%', status: 'healthy' },
  { id: 'achievement', goal: 'Goal Achievement Tracking', owner: 'Executive Copilot', actionPlan: 'Summarize progress, blockers and next autonomous action recommendations.', progress: '69%', status: 'watch' },
  { id: 'plans', goal: 'Automated Action Plans', owner: 'Agent Collaboration Network', actionPlan: 'Convert approved strategic recommendations into executable task and workflow plans.', progress: '71%', status: 'accelerating' },
];

export const selfOptimizingSignals: OptimizationSignal[] = [
  { id: 'performance', signal: 'Performance Monitoring', area: 'Platform, workflow and agent execution', recommendation: 'Track execution latency, success rate and manual override patterns.', impact: 'Improves autonomous reliability and executive trust.', status: 'healthy' },
  { id: 'suggestions', signal: 'Optimization Suggestions', area: 'Process, budget, customer and workforce operations', recommendation: 'Rank optimization ideas by impact, confidence and risk.', impact: 'Focuses teams on improvements with measurable business value.', status: 'accelerating' },
  { id: 'continuous', signal: 'Continuous Improvement', area: 'Self-optimizing operations layer', recommendation: 'Review outcomes and adapt playbooks after every execution cycle.', impact: 'Makes the platform learn from decisions and execution results.', status: 'healthy' },
  { id: 'ai-enhancements', signal: 'AI Driven Enhancements', area: 'Agents, workflows, insights and recommendations', recommendation: 'Promote proven agent skills into reusable enterprise automation patterns.', impact: 'Compounds automation quality over time.', status: 'healthy' },
];

export const knowledgeReasoningSignals: KnowledgeReasoningSignal[] = [
  { id: 'relationships', capability: 'Relationship Discovery', context: 'Customers, revenue, workflows, KPIs, teams, assets and risks', intelligence: 'Discovers which entities drive business outcomes and where intervention matters.', status: 'healthy' },
  { id: 'context', capability: 'Context Awareness', context: 'Workspace, role, industry, country, goals and enabled modules', intelligence: 'Adapts recommendations to each tenant and executive role.', status: 'healthy' },
  { id: 'linking', capability: 'Knowledge Linking', context: 'Business ontology, memory, activity, decisions and reports', intelligence: 'Links facts into an enterprise reasoning graph for agent retrieval.', status: 'accelerating' },
  { id: 'enterprise', capability: 'Enterprise Intelligence', context: 'Operating system wide signals', intelligence: 'Turns fragmented business data into coherent strategic context.', status: 'healthy' },
];

export const strategyPlanSignals: StrategyPlanSignal[] = [
  { id: 'quarterly', plan: 'Quarterly Planning', horizon: 'Next 90 days', roadmap: 'Revenue expansion, retention, AI automation and reliability improvements.', outcome: 'A focused execution plan tied to owners and KPIs.', status: 'healthy' },
  { id: 'annual', plan: 'Annual Planning', horizon: 'Next 12 months', roadmap: 'Global scale, marketplace growth, enterprise AI expansion and operating leverage.', outcome: 'Strategic roadmap with budget and capacity assumptions.', status: 'accelerating' },
  { id: 'roadmaps', plan: 'Strategic Roadmaps', horizon: 'Cross-functional roadmap', roadmap: 'Product, success, sales, operations, security and AI governance milestones.', outcome: 'Keeps strategy connected to execution.', status: 'healthy' },
  { id: 'growth', plan: 'Growth Planning', horizon: 'Expansion and acquisition', roadmap: 'Account expansion, new markets, AI Enterprise and partner ecosystem acceleration.', outcome: 'Turns growth recommendations into measurable plays.', status: 'accelerating' },
];

export const executiveCopilotCommands: ExecutiveCopilotCommand[] = [
  { id: 'risks', command: 'Show business risks', response: 'Summarize revenue, churn, hiring, capacity and operational risks with owners and urgency.' },
  { id: 'opportunities', command: 'Show growth opportunities', response: 'Rank expansion, automation, marketplace and AI Enterprise opportunities by business impact.' },
  { id: 'optimize', command: 'Optimize operations', response: 'Identify bottlenecks, process improvements, automation suggestions and cost reduction recommendations.' },
  { id: 'plan', command: 'Generate executive plan', response: 'Create a quarterly or annual executive plan with goals, scenarios, owners and approval gates.' },
  { id: 'forecast', command: 'Forecast business performance', response: 'Forecast revenue, churn, hiring needs, capacity requirements and operational risks.' },
  { id: 'strategy', command: 'Recommend strategic actions', response: 'Recommend safe, high-impact actions with evidence, confidence and next workflow steps.' },
];

export const autonomousNavigation = [
  { group: 'Autonomy', items: ['Command Center', 'Reasoning Engine', 'Workflow Optimization', 'Self Optimizing Operations'] },
  { group: 'Agents', items: ['Multi-Agent Network', 'Executive Advisor', 'Executive Copilot'] },
  { group: 'Strategy', items: ['Decision Intelligence', 'Simulation Engine', 'Goal Automation', 'Strategy Planner'] },
  { group: 'Knowledge', items: ['Knowledge Reasoning Graph', 'Enterprise Intelligence'] },
];

export const phase67Routes: AutonomousEnterpriseRoute[] = [
  {
    "path": "/autonomous-enterprise",
    "module": "Autonomous Enterprise Workspace",
    "marker": "Enterprise Health"
  },
  {
    "path": "/autonomous-enterprise/command-center",
    "module": "Autonomous Enterprise Command Center",
    "marker": "Strategic Recommendations"
  },
  {
    "path": "/autonomous-enterprise/reasoning-engine",
    "module": "Advanced Reasoning Engine",
    "marker": "Chain Of Thought Planning"
  },
  {
    "path": "/autonomous-enterprise/multi-agent-network",
    "module": "Multi-Agent Collaboration Network",
    "marker": "Agent Communication"
  },
  {
    "path": "/autonomous-enterprise/executive-advisor",
    "module": "AI Executive Advisor",
    "marker": "CEO Advisor"
  },
  {
    "path": "/autonomous-enterprise/workflow-optimization",
    "module": "Autonomous Workflow Optimization",
    "marker": "Bottleneck Detection"
  },
  {
    "path": "/autonomous-enterprise/decision-intelligence",
    "module": "Predictive Decision Intelligence",
    "marker": "Capacity Requirements"
  },
  {
    "path": "/autonomous-enterprise/simulation-engine",
    "module": "Business Simulation Engine",
    "marker": "What If Analysis"
  },
  {
    "path": "/autonomous-enterprise/goal-automation",
    "module": "Goal Driven Enterprise Automation",
    "marker": "Goal Assignment"
  },
  {
    "path": "/autonomous-enterprise/self-optimizing-operations",
    "module": "Self Optimizing Operations Layer",
    "marker": "Continuous Improvement"
  },
  {
    "path": "/autonomous-enterprise/knowledge-reasoning-graph",
    "module": "Enterprise Knowledge Reasoning Graph",
    "marker": "Relationship Discovery"
  },
  {
    "path": "/autonomous-enterprise/strategy-planner",
    "module": "AI Strategy Planner",
    "marker": "Quarterly Planning"
  },
  {
    "path": "/autonomous-enterprise/executive-copilot",
    "module": "Executive Copilot Workspace",
    "marker": "Show business risks"
  },
  {
    "path": "/workspace/autonomous-enterprise",
    "module": "Autonomous Enterprise compatibility route",
    "marker": "Enterprise Health"
  }
];
