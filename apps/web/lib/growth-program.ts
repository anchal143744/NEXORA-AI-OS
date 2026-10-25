import type {
  AdoptionSignal,
  AgentNetworkSignal,
  AiExpansionCapability,
  EnterpriseAccount,
  EnterpriseSuccessMetric,
  ExecutiveGrowthCommand,
  ExpansionOpportunity,
  GrowthMetric,
  GrowthProgramRoute,
  RetentionSignal,
  RevenueExpansionMetric,
  ScaleReadinessCheck,
  UsageMetric,
} from '@/types/growth-program';

export const growthMetrics: GrowthMetric[] = [
  { id: 'active-orgs', label: 'Active Organizations', value: '412', detail: 'Organizations with active workspaces, users and business operations in the last 30 days.', status: 'accelerating' },
  { id: 'active-users', label: 'Active Users', value: '18.6k', detail: 'Users active across command center, CRM, people, finance, analytics, AI agents and marketplace.', status: 'healthy' },
  { id: 'revenue-growth', label: 'Revenue Growth', value: '+38%', detail: 'Blended subscription, AI usage and marketplace revenue growth after launch.', status: 'accelerating' },
  { id: 'expansion-revenue', label: 'Expansion Revenue', value: '$420k', detail: 'Expansion revenue from plan upgrades, AI Enterprise, marketplace and additional departments.', status: 'accelerating' },
  { id: 'churn-risk', label: 'Churn Risk', value: '6.4%', detail: 'Weighted churn exposure from usage drop, low adoption and health score decline.', status: 'watch' },
  { id: 'adoption-trends', label: 'Adoption Trends', value: '+22%', detail: 'Feature and workflow adoption trend across launch cohorts and enterprise customers.', status: 'healthy' },
];

export const adoptionSignals: AdoptionSignal[] = [
  { id: 'feature-adoption', signal: 'Feature Adoption Tracking', segment: 'Business and Enterprise plans', value: '72%', businessImpact: 'Higher activation across CRM, Finance, AI Agents and Analytics.', status: 'healthy' },
  { id: 'journey', signal: 'User Journey Analytics', segment: 'New launch cohorts', value: '9.4 min TTV', businessImpact: 'Fast time to first workspace value improves trial conversion.', status: 'accelerating' },
  { id: 'time-to-value', signal: 'Time To Value Analysis', segment: 'Enterprise trials', value: '84% under target', businessImpact: 'Guided setup and demo data reduce onboarding friction.', status: 'healthy' },
  { id: 'segmentation', signal: 'Usage Segmentation', segment: 'Executives, operators and builders', value: '5 segments', businessImpact: 'Role-based nudges increase depth of usage.', status: 'healthy' },
];

export const expansionOpportunities: ExpansionOpportunity[] = [
  { id: 'northstar', account: 'Northstar Manufacturing', opportunity: 'AI Enterprise upgrade', value: '$96k ARR', recommendation: 'Attach forecasting agents, manufacturing analytics and executive war room.', status: 'accelerating' },
  { id: 'atlas', account: 'Atlas Retail Group', opportunity: 'Inventory + Finance expansion', value: '$72k ARR', recommendation: 'Bundle inventory planning, cash flow intelligence and supply chain copilot.', status: 'healthy' },
  { id: 'helios', account: 'Helios Consulting', opportunity: 'Cross-Sell Opportunities', value: '$38k ARR', recommendation: 'Recommend marketplace apps, CRM automation and partner analytics extensions.', status: 'healthy' },
  { id: 'elysian', account: 'Elysian Health', opportunity: 'Enterprise compliance upgrade', value: '$114k ARR', recommendation: 'Add trust center, security intelligence and data residency readiness.', status: 'watch' },
];

export const enterpriseAccounts: EnterpriseAccount[] = [
  { id: 'strategic', account: 'Strategic Accounts', renewal: '94% renewal confidence', executiveRelationship: 'CFO, COO and CIO sponsors mapped', growthPlan: 'Quarterly executive value review and AI expansion plan.', status: 'healthy' },
  { id: 'renewals', account: 'Renewal Tracking', renewal: '$1.8M ARR in next 120 days', executiveRelationship: 'Success-owned renewal rooms', growthPlan: 'Trigger retention playbooks where usage declines.', status: 'watch' },
  { id: 'relationships', account: 'Executive Relationships', renewal: '38 executive sponsors', executiveRelationship: 'Board, C-suite and transformation leaders', growthPlan: 'Launch executive growth intelligence briefings.', status: 'accelerating' },
  { id: 'plans', account: 'Growth Plans', renewal: '56 active plans', executiveRelationship: 'CSM and sales paired ownership', growthPlan: 'Expansion, adoption and renewal outcomes tracked together.', status: 'healthy' },
];

export const aiExpansionCapabilities: AiExpansionCapability[] = [
  { id: 'advanced-agents', capability: 'Advanced AI Agents', scope: 'Sales, HR, Finance, Support, Operations and Executive agents', businessImpact: 'Automates complex cross-department workflows with approval controls.', status: 'accelerating' },
  { id: 'collaboration', capability: 'Agent Collaboration', scope: 'Multi-agent routing and shared execution context', businessImpact: 'Allows agents to coordinate revenue, finance and success actions.', status: 'healthy' },
  { id: 'skills-library', capability: 'AI Skills Library', scope: 'Reusable skills for reporting, forecasting, follow-up and analysis', businessImpact: 'Speeds agent deployment and standardizes trusted automation.', status: 'healthy' },
  { id: 'decision-intelligence', capability: 'AI Decision Intelligence', scope: 'Reasoning, impact scoring, audit and explainability', businessImpact: 'Makes AI recommendations understandable to operators and executives.', status: 'healthy' },
];

export const agentNetworkSignals: AgentNetworkSignal[] = [
  { id: 'agent-communication', network: 'Agent-to-Agent Communication', collaboration: 'Sales Agent routes renewal risk to Finance and Success agents.', sharedMemory: 'Shared account health, contract and revenue context.', workflow: 'Expansion workflow with approval policies.', status: 'healthy' },
  { id: 'shared-memory', network: 'Shared Memory', collaboration: 'Agents reference goals, KPIs, decisions and customer context.', sharedMemory: 'Workspace, business, conversation and agent memory layers.', workflow: 'Context retrieval before action execution.', status: 'healthy' },
  { id: 'collaboration', network: 'Agent Collaboration', collaboration: 'Operations and Analytics agents assemble cross-module recommendations.', sharedMemory: 'Workflow state, activity stream and knowledge graph context.', workflow: 'Executive summary generation.', status: 'accelerating' },
  { id: 'enterprise-workflows', network: 'Enterprise Workflows', collaboration: 'Agents trigger workflows with role and approval enforcement.', sharedMemory: 'Audit, policy and outcome history.', workflow: 'Self-optimizing business operations preparation.', status: 'watch' },
];

export const usageMetrics: UsageMetric[] = [
  { id: 'dau', metric: 'DAU', value: '7.8k', trend: '+18%', interpretation: 'Daily active usage is strongest in CRM, command center and finance workspaces.' },
  { id: 'wau', metric: 'WAU', value: '14.2k', trend: '+24%', interpretation: 'Weekly adoption expands as more teams activate AI agents and analytics.' },
  { id: 'mau', metric: 'MAU', value: '18.6k', trend: '+29%', interpretation: 'Monthly users track with launch growth and enterprise rollout activity.' },
  { id: 'feature', metric: 'Feature Usage', value: '68%', trend: '+12%', interpretation: 'AI Agents, Analytics and Finance features show strong expansion signals.' },
  { id: 'workspace', metric: 'Workspace Activity', value: '412 orgs', trend: '+17%', interpretation: 'Workspace activity confirms multi-department adoption.' },
  { id: 'ai', metric: 'AI Utilization', value: '2.4M tokens/day', trend: '+31%', interpretation: 'AI copilot and agent usage is becoming a growth driver.' },
];

export const revenueExpansionMetrics: RevenueExpansionMetric[] = [
  { id: 'mrr', metric: 'MRR', value: '$286k', forecast: '+34% next quarter', action: 'Prioritize Business and Enterprise upgrades in high-adoption accounts.' },
  { id: 'arr', metric: 'ARR', value: '$3.43M', forecast: '$5.1M projected', action: 'Forecast ARR from trial conversion, expansion and AI usage.' },
  { id: 'expansion', metric: 'Expansion Revenue', value: '$420k', forecast: '+41% pipeline', action: 'Trigger expansion recommendations for high health score accounts.' },
  { id: 'ltv', metric: 'Customer Lifetime Value', value: '$84k', forecast: '+16% with AI Enterprise', action: 'Attach AI expansion and marketplace bundles.' },
  { id: 'forecasting', metric: 'Revenue Forecasting', value: '92% confidence', forecast: 'Healthy growth path', action: 'Route forecast assumptions into executive growth intelligence.' },
];

export const retentionSignals: RetentionSignal[] = [
  { id: 'orion', customer: 'Orion SaaS', healthScore: '91', churnRisk: 'Low', playbook: 'Expand AI Agents and Analytics adoption.', status: 'healthy' },
  { id: 'meridian', customer: 'Meridian Logistics', healthScore: '74', churnRisk: 'Medium', playbook: 'Launch workflow automation enablement and executive review.', status: 'watch' },
  { id: 'summit', customer: 'Summit Agency', healthScore: '87', churnRisk: 'Low', playbook: 'Cross-sell marketplace and CRM automation bundles.', status: 'healthy' },
  { id: 'cobalt', customer: 'Cobalt Finance', healthScore: '69', churnRisk: 'Elevated', playbook: 'Run retention playbook, security review and finance success plan.', status: 'watch' },
];

export const scaleReadinessChecks: ScaleReadinessCheck[] = [
  { id: 'multi-region', domain: 'Multi-Region Support', readiness: 90, validation: 'Production deployment and data residency foundations are ready for regional expansion.', status: 'healthy' },
  { id: 'localization', domain: 'Localization Readiness', readiness: 88, validation: 'Localization, country intelligence, language and timezone foundations are available.', status: 'healthy' },
  { id: 'currency', domain: 'Currency Support', readiness: 91, validation: 'Multi-currency, tax and global invoicing foundations support international expansion.', status: 'healthy' },
  { id: 'timezone', domain: 'Time Zone Support', readiness: 92, validation: 'Timezone engine, calendar intelligence and workspace preferences support global operations.', status: 'healthy' },
  { id: 'international', domain: 'International Expansion', readiness: 86, validation: 'Compliance, residency, partner marketplace and launch readiness are ready with tracked remediation.', status: 'watch' },
];

export const enterpriseSuccessMetrics: EnterpriseSuccessMetric[] = [
  { id: 'adoption', metric: 'Adoption', value: '74%', impact: 'Customers are expanding from command center into multi-module operating workflows.' },
  { id: 'revenue', metric: 'Revenue', value: '+38%', impact: 'Expansion revenue and AI Enterprise packages are lifting revenue growth.' },
  { id: 'retention', metric: 'Retention', value: '93.6%', impact: 'Health scores and retention playbooks keep churn risk visible.' },
  { id: 'ai-usage', metric: 'AI Usage', value: '+31%', impact: 'AI agents and copilots are becoming central to customer workflows.' },
  { id: 'expansion', metric: 'Expansion Opportunities', value: '36', impact: 'Enterprise upgrades and cross-sell opportunities are actionable.' },
];

export const executiveGrowthCommands: ExecutiveGrowthCommand[] = [
  { id: 'growth-trends', command: 'Show growth trends', response: 'Summarize active organizations, active users, revenue growth, expansion revenue and adoption trends.' },
  { id: 'expansion', command: 'Identify expansion opportunities', response: 'Rank upsell, cross-sell and enterprise upgrade opportunities by value and readiness.' },
  { id: 'churn', command: 'Predict churn', response: 'Explain churn risk using health scores, usage decline, adoption depth and retention playbook status.' },
  { id: 'arr', command: 'Forecast ARR', response: 'Forecast ARR from MRR, expansion revenue, trial conversion and AI Enterprise adoption.' },
  { id: 'actions', command: 'Recommend growth actions', response: 'Prioritize growth actions for sales, success, AI expansion and global readiness owners.' },
  { id: 'health', command: 'Show enterprise health', response: 'Show adoption, revenue, retention, AI usage and expansion opportunity health in one view.' },
];

export const growthProgramNavigation = [
  { group: 'Growth', items: ['Command Center', 'Adoption', 'Expansion', 'Revenue'] },
  { group: 'AI Scale', items: ['AI Expansion', 'Multi-Agent Network', 'Usage Analytics', 'Decision Intelligence'] },
  { group: 'Enterprise', items: ['Accounts', 'Retention', 'Global Scale', 'Executive Growth'] },
];

export const phase66Routes: GrowthProgramRoute[] = [
  { path: '/growth-program', module: 'Growth Program Workspace', marker: 'Active Organizations' },
  { path: '/growth-program/growth-command-center', module: 'Growth Command Center', marker: 'Churn Risk' },
  { path: '/growth-program/product-adoption', module: 'Product Adoption Intelligence', marker: 'Time To Value Analysis' },
  { path: '/growth-program/customer-expansion', module: 'Customer Expansion Engine', marker: 'Upsell Opportunities' },
  { path: '/growth-program/account-management', module: 'Enterprise Account Management', marker: 'Strategic Accounts' },
  { path: '/growth-program/ai-expansion', module: 'AI Expansion Platform', marker: 'AI Skills Library' },
  { path: '/growth-program/multi-agent-network', module: 'Multi-Agent Intelligence Network', marker: 'Agent-to-Agent Communication' },
  { path: '/growth-program/usage-analytics', module: 'Usage Analytics Center', marker: 'DAU' },
  { path: '/growth-program/revenue-expansion', module: 'Revenue Expansion Intelligence', marker: 'ARR' },
  { path: '/growth-program/customer-retention', module: 'Customer Retention Center', marker: 'Churn Prediction' },
  { path: '/growth-program/global-scale', module: 'Global Scale Readiness', marker: 'Multi-Region Support' },
  { path: '/growth-program/enterprise-success', module: 'Enterprise Success Dashboard', marker: 'AI Usage' },
  { path: '/growth-program/executive-growth', module: 'Executive Growth Intelligence', marker: 'Show growth trends' },
  { path: '/workspace/growth-program', module: 'Growth Program compatibility route', marker: 'Active Organizations' },
];
