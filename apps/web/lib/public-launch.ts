import type {
  AdoptionIntelligenceSignal,
  AcquisitionSignal,
  CustomerSuccessLaunchItem,
  ExecutiveWarRoomSignal,
  GlobalReadinessCheck,
  LaunchAnalyticsSignal,
  LaunchChecklistItem,
  LaunchCopilotCommand,
  LaunchMetric,
  LaunchMilestone,
  LaunchRisk,
  PricingPlan,
  PublicLaunchRoute,
  PublicWebsitePage,
  SalesEnablementAsset,
  TrialExperienceStep,
  MarketingMessage,
} from '@/types/public-launch';

export const launchMetrics: LaunchMetric[] = [
  { id: 'readiness-score', label: 'Launch Readiness Score', value: '94%', detail: 'Weighted score across product, security, scalability, documentation, sales and success readiness.' },
  { id: 'active-trials', label: 'Active Trials', value: '128', detail: 'Enterprise and mid-market trial workspaces ready for guided activation and conversion tracking.' },
  { id: 'new-customers', label: 'New Customers', value: '42', detail: 'Launch cohort customers with onboarding, health scores and adoption goals.' },
  { id: 'revenue-growth', label: 'Revenue Growth', value: '+31%', detail: 'Projected launch revenue growth from subscriptions, marketplace and AI enterprise plans.' },
  { id: 'global-readiness', label: 'Global Readiness', value: '91%', detail: 'Performance, security, compliance, scalability and documentation validation status.' },
  { id: 'sentiment', label: 'Customer Sentiment', value: 'Positive', detail: 'Launch feedback, NPS and customer success signals show healthy launch sentiment.' },
];

export const launchChecklist: LaunchChecklistItem[] = [
  { id: 'product', title: 'Product release candidate validated', owner: 'Product Operations', status: 'ready', evidence: 'Backend, frontend, AI and ecosystem layers validated through Phase 64.' },
  { id: 'pricing', title: 'Pricing and packaging approved', owner: 'Revenue Operations', status: 'ready', evidence: 'Starter, Growth, Business, Enterprise and AI Enterprise packaging defined.' },
  { id: 'security', title: 'Security and trust evidence ready', owner: 'Security Operations', status: 'watch', evidence: '0 critical advisories; 12 non-critical advisories tracked for semver-major remediation.' },
  { id: 'sales', title: 'Sales enablement published', owner: 'Enterprise Sales', status: 'ready', evidence: 'Playbooks, demo scripts, proposal templates and ROI calculators staged.' },
  { id: 'success', title: 'Customer success launch hub ready', owner: 'Customer Success', status: 'ready', evidence: 'Onboarding, adoption tracking, health scores and success plans mapped.' },
];

export const launchMilestones: LaunchMilestone[] = [
  { id: 'website', milestone: 'Public launch website live', target: 'Launch week', status: 'ready', dependency: 'Home, Product, Solutions, Industries, Pricing, Security, Marketplace, Developers and Contact Sales routes.' },
  { id: 'trial', milestone: 'Enterprise trial onboarding live', target: 'Launch week', status: 'ready', dependency: 'Instant workspace creation, guided setup and demo data.' },
  { id: 'gtm', milestone: 'Go-to-market campaign active', target: 'Launch week', status: 'active', dependency: 'Messaging, acquisition tracking and launch analytics.' },
  { id: 'war-room', milestone: 'Executive Launch War Room operating', target: 'Launch week', status: 'ready', dependency: 'Launch health, risks, opportunities, sentiment and revenue metrics.' },
];

export const launchRisks: LaunchRisk[] = [
  { id: 'dependency-audit', risk: 'Dependency advisories need major-version decisions', severity: 'high', mitigation: 'Keep advisories tracked, 0 critical, and schedule dedicated dependency remediation before GA hardening.', status: 'watch' },
  { id: 'trial-volume', risk: 'Trial activation volume spike', severity: 'medium', mitigation: 'Use onboarding automation, demo data and success milestone monitoring.', status: 'ready' },
  { id: 'enterprise-docs', risk: 'Enterprise buyers request deeper procurement evidence', severity: 'medium', mitigation: 'Route security, pricing, ROI and trust artifacts through launch command center.', status: 'ready' },
];

export const pricingPlans: PricingPlan[] = [
  { id: 'starter', name: 'Starter', audience: 'Small teams starting with adaptive operations', monthlyPrice: '$49/user', usageLimit: 'Core workspaces and standard AI usage', billingIntegration: 'Subscription billing', features: ['CRM', 'Projects', 'Basic Analytics', 'Email support'] },
  { id: 'growth', name: 'Growth', audience: 'Growing businesses scaling teams and workflows', monthlyPrice: '$89/user', usageLimit: 'Expanded modules and automation usage', billingIntegration: 'Subscription and usage billing', features: ['CRM', 'Finance', 'People', 'Workflows', 'AI Copilot'] },
  { id: 'business', name: 'Business', audience: 'Multi-department operators', monthlyPrice: '$149/user', usageLimit: 'Advanced analytics and AI agents', billingIntegration: 'Invoice and card billing', features: ['Revenue Ops', 'HR', 'Finance', 'Analytics', 'AI Agents'] },
  { id: 'enterprise', name: 'Enterprise', audience: 'Global organizations and regulated teams', monthlyPrice: 'Custom', usageLimit: 'Enterprise-scale workspaces and governance', billingIntegration: 'Contract billing', features: ['Security', 'Compliance', 'Data Residency', 'SLA', 'Dedicated success'] },
  { id: 'ai-enterprise', name: 'AI Enterprise', audience: 'Organizations deploying autonomous AI operations', monthlyPrice: 'Custom', usageLimit: 'Advanced agent execution and model governance', billingIntegration: 'Enterprise AI usage billing', features: ['AI Agents', 'ModelOps', 'AI Governance', 'Workflow Automation', 'Executive Intelligence'] },
];

export const trialExperience: TrialExperienceStep[] = [
  { id: 'workspace', step: 'Instant Workspace Creation', outcome: 'Trial users land in a generated workspace in under two minutes.', metric: 'Workspace activation', status: 'ready' },
  { id: 'setup', step: 'Guided Setup', outcome: 'Industry, team and module recommendations guide first-time configuration.', metric: 'Setup completion', status: 'ready' },
  { id: 'demo-data', step: 'Demo Data', outcome: 'Launch-ready sample CRM, HR, finance, analytics and AI agent data supports evaluation.', metric: 'Demo engagement', status: 'ready' },
  { id: 'conversion', step: 'Trial Conversion Tracking', outcome: 'Trial health, activation, adoption and conversion signals route to sales and success.', metric: 'Trial conversion', status: 'active' },
];

export const marketingMessages: MarketingMessage[] = [
  { id: 'positioning', area: 'Positioning', headline: 'The Adaptive AI Business Operating System for global teams.', proof: 'Unifies CRM, finance, HR, analytics, AI agents, workflows, marketplace and governance.' },
  { id: 'value-props', area: 'Value Propositions', headline: 'Run the business from one intelligent operating layer.', proof: 'Launch workspaces adapt by industry, role, country, goals and enabled modules.' },
  { id: 'industry', area: 'Industry Messaging', headline: 'Built for SaaS, agencies, commerce, manufacturing, finance and enterprise operations.', proof: 'Blueprints, modules, KPIs and AI agents adjust by business profile.' },
  { id: 'differentiation', area: 'Competitive Differentiation', headline: 'More adaptive than CRM, broader than ERP, more intelligent than dashboards.', proof: 'NEXORA combines operating workflows, AI copilots, agents, analytics and ecosystem marketplace.' },
];

export const acquisitionSignals: AcquisitionSignal[] = [
  { id: 'organic', channel: 'Organic Launch', leads: '1.8k', signups: '420', conversions: '72', revenue: '$96k' },
  { id: 'partner', channel: 'Partner Referrals', leads: '640', signups: '210', conversions: '58', revenue: '$141k' },
  { id: 'enterprise', channel: 'Enterprise Sales', leads: '180', signups: '64', conversions: '24', revenue: '$384k' },
  { id: 'marketplace', channel: 'Marketplace Discovery', leads: '520', signups: '155', conversions: '31', revenue: '$73k' },
];

export const salesEnablementAssets: SalesEnablementAsset[] = [
  { id: 'playbooks', asset: 'Sales Playbooks', audience: 'Account executives', outcome: 'Discovery, qualification and enterprise buyer journey guidance.', status: 'ready' },
  { id: 'demo-scripts', asset: 'Demo Scripts', audience: 'Sales engineers', outcome: 'Role-based demos for executives, operations, finance, HR and AI teams.', status: 'ready' },
  { id: 'proposals', asset: 'Proposal Templates', audience: 'Enterprise sales', outcome: 'Pricing, implementation, security and rollout proposal structure.', status: 'ready' },
  { id: 'roi', asset: 'ROI Calculators', audience: 'Buyers and champions', outcome: 'Automation savings, productivity gains and revenue expansion modeling.', status: 'active' },
];

export const publicWebsitePages: PublicWebsitePage[] = [
  { id: 'home', label: 'Home', path: '/launch', promise: 'NEXORA AI OS v2.0 launch home for enterprise buyers.', primaryCta: 'Start enterprise trial' },
  { id: 'product', label: 'Product', path: '/product', promise: 'Adaptive AI Business Operating System overview.', primaryCta: 'Explore product' },
  { id: 'solutions', label: 'Solutions', path: '/solutions', promise: 'Solutions for revenue, people, finance, operations, AI and analytics.', primaryCta: 'Find solution' },
  { id: 'industries', label: 'Industries', path: '/industries', promise: 'Industry launch messaging for SaaS, agency, ecommerce, manufacturing and enterprise.', primaryCta: 'Choose industry' },
  { id: 'pricing', label: 'Pricing', path: '/pricing', promise: 'Starter, Growth, Business, Enterprise and AI Enterprise packaging.', primaryCta: 'View pricing' },
  { id: 'security', label: 'Security', path: '/security', promise: 'Security, trust, compliance and data protection for enterprise buyers.', primaryCta: 'Review trust center' },
  { id: 'marketplace', label: 'Marketplace', path: '/marketplace', promise: 'Apps, integrations, AI agents and partner ecosystem discovery.', primaryCta: 'Browse marketplace' },
  { id: 'developers', label: 'Developers', path: '/developers', promise: 'Developer platform, API docs, SDKs, webhooks and sandbox resources.', primaryCta: 'Open developer portal' },
  { id: 'contact-sales', label: 'Contact Sales', path: '/contact-sales', promise: 'Enterprise sales intake for demos, pricing and launch consultation.', primaryCta: 'Contact Sales' },
];

export const customerSuccessLaunchItems: CustomerSuccessLaunchItem[] = [
  { id: 'onboarding', program: 'Customer Onboarding', metric: '10 minute setup target', owner: 'Success Operations', status: 'ready' },
  { id: 'adoption', program: 'Adoption Tracking', metric: 'Feature and workspace activation', owner: 'Customer Success', status: 'ready' },
  { id: 'plans', program: 'Success Plans', metric: 'Milestones and business outcomes', owner: 'Customer Success', status: 'active' },
  { id: 'health', program: 'Health Scores', metric: 'Usage, sentiment, risk and value realization', owner: 'Customer Success', status: 'ready' },
];

export const globalReadinessChecks: GlobalReadinessCheck[] = [
  { id: 'performance', domain: 'Performance', score: 92, validation: 'Next build passed with 162 static routes and route smoke is planned across launch surfaces.', status: 'ready' },
  { id: 'security', domain: 'Security', score: 88, validation: '0 critical advisories; tracked non-critical dependency remediation remains visible.', status: 'watch' },
  { id: 'compliance', domain: 'Compliance', score: 90, validation: 'Trust, privacy, evidence and data governance surfaces are connected from earlier phases.', status: 'ready' },
  { id: 'scalability', domain: 'Scalability', score: 91, validation: 'Production deployment, observability, global operations and marketplace foundations are present.', status: 'ready' },
  { id: 'documentation', domain: 'Documentation', score: 95, validation: 'Roadmap, changelog, status, launch reports and release report are maintained.', status: 'ready' },
];

export const adoptionIntelligenceSignals: AdoptionIntelligenceSignal[] = [
  { id: 'user-adoption', metric: 'User Adoption', value: '74%', trend: '+12%', recommendation: 'Push guided tours to teams with incomplete setup.' },
  { id: 'feature-adoption', metric: 'Feature Adoption', value: '68%', trend: '+9%', recommendation: 'Promote AI agents, analytics and marketplace bundles after first workspace activation.' },
  { id: 'retention', metric: 'Retention', value: '91%', trend: '+5%', recommendation: 'Trigger success plans for users with low week-two activity.' },
  { id: 'expansion', metric: 'Expansion Opportunities', value: '36 accounts', trend: '+18%', recommendation: 'Route high-adoption accounts to Business, Enterprise and AI Enterprise packages.' },
];

export const launchAnalyticsSignals: LaunchAnalyticsSignal[] = [
  { id: 'new-customers', metric: 'New Customers', value: '42', trend: '+16%', insight: 'Partner referrals and enterprise sales are driving launch customer growth.' },
  { id: 'active-trials', metric: 'Active Trials', value: '128', trend: '+23%', insight: 'Guided setup and demo data improve trial activation velocity.' },
  { id: 'revenue-growth', metric: 'Revenue Growth', value: '+31%', trend: '+8%', insight: 'AI Enterprise and Marketplace plans increase expansion potential.' },
  { id: 'adoption-trends', metric: 'Adoption Trends', value: 'Healthy', trend: '+11%', insight: 'Command Center, CRM, Finance and AI Agents show strongest early usage.' },
];

export const executiveWarRoomSignals: ExecutiveWarRoomSignal[] = [
  { id: 'launch-health', signal: 'Launch Health', value: 'Green', interpretation: 'Product, docs, trial, sales and success are launch ready.', action: 'Maintain executive daily launch review.' },
  { id: 'risks', signal: 'Risks', value: '3 tracked', interpretation: 'Dependency remediation, trial volume and evidence depth are actively monitored.', action: 'Keep mitigation owners assigned.' },
  { id: 'opportunities', signal: 'Opportunities', value: '36 expansion signals', interpretation: 'Business and AI Enterprise packaging has strong expansion potential.', action: 'Route to sales and success.' },
  { id: 'customer-sentiment', signal: 'Customer Sentiment', value: 'Positive', interpretation: 'Feedback and NPS are trending positively in launch cohorts.', action: 'Amplify testimonials and product proof.' },
  { id: 'revenue', signal: 'Revenue Metrics', value: '$694k pipeline', interpretation: 'Enterprise sales and partner referrals carry launch revenue.', action: 'Prioritize enterprise trial conversion.' },
];

export const launchCopilotCommands: LaunchCopilotCommand[] = [
  { id: 'readiness', command: 'Show launch readiness', response: 'Summarize checklist, milestones, risks and global readiness score.' },
  { id: 'adoption', command: 'Analyze adoption', response: 'Explain user adoption, feature adoption, retention and expansion opportunities.' },
  { id: 'forecast', command: 'Forecast revenue', response: 'Estimate launch revenue from trials, enterprise sales, marketplace and AI Enterprise plans.' },
  { id: 'growth', command: 'Show customer growth', response: 'Show new customers, active trials, conversions and acquisition channels.' },
  { id: 'risks', command: 'Identify launch risks', response: 'List launch blockers, severity, owners and mitigation status.' },
  { id: 'actions', command: 'Recommend next actions', response: 'Prioritize launch actions for product, sales, success, marketing and executives.' },
];

export const publicLaunchNavigation = [
  { group: 'Launch', items: ['Command Center', 'Milestones', 'Risks', 'War Room'] },
  { group: 'Go To Market', items: ['Pricing', 'Marketing', 'Acquisition', 'Sales Enablement'] },
  { group: 'Adoption', items: ['Trial Experience', 'Customer Success', 'Adoption Intelligence', 'Analytics'] },
];

export const phase65Routes: PublicLaunchRoute[] = [
  { path: '/public-launch', module: 'Public Launch Workspace', marker: 'Launch Readiness Score' },
  { path: '/public-launch/launch-command-center', module: 'Launch Command Center', marker: 'Launch Checklist' },
  { path: '/public-launch/pricing-packaging', module: 'Pricing & Packaging Platform', marker: 'AI Enterprise' },
  { path: '/public-launch/enterprise-trial', module: 'Enterprise Trial Experience', marker: 'Instant Workspace Creation' },
  { path: '/public-launch/product-marketing', module: 'Product Marketing Center', marker: 'Competitive Differentiation' },
  { path: '/public-launch/customer-acquisition', module: 'Customer Acquisition Engine', marker: 'Trial Activations' },
  { path: '/public-launch/sales-enablement', module: 'Enterprise Sales Enablement', marker: 'ROI Calculators' },
  { path: '/public-launch/launch-website', module: 'Public Launch Website', marker: 'Contact Sales' },
  { path: '/public-launch/customer-success', module: 'Customer Success Launch Hub', marker: 'Health Scores' },
  { path: '/public-launch/global-readiness', module: 'Global Readiness Validation', marker: 'Scalability' },
  { path: '/public-launch/adoption-intelligence', module: 'Adoption Intelligence Center', marker: 'Expansion Opportunities' },
  { path: '/public-launch/launch-analytics', module: 'Launch Analytics Dashboard', marker: 'Revenue Growth' },
  { path: '/public-launch/executive-war-room', module: 'Executive Launch War Room', marker: 'Customer Sentiment' },
  { path: '/public-launch/copilot', module: 'AI Launch Copilot', marker: 'Show launch readiness' },
  { path: '/workspace/public-launch', module: 'Public Launch compatibility route', marker: 'Launch Readiness Score' },
  { path: '/launch', module: 'Public Website Home', marker: 'NEXORA AI OS v2.0' },
  { path: '/product', module: 'Public Website Product', marker: 'Adaptive AI Business Operating System' },
  { path: '/solutions', module: 'Public Website Solutions', marker: 'Solutions' },
  { path: '/industries', module: 'Public Website Industries', marker: 'Industries' },
  { path: '/pricing', module: 'Public Website Pricing', marker: 'AI Enterprise' },
  { path: '/security', module: 'Public Website Security', marker: 'Security' },
  { path: '/marketplace', module: 'Public Website Marketplace', marker: 'Marketplace' },
  { path: '/developers', module: 'Public Website Developers', marker: 'Developers' },
  { path: '/contact-sales', module: 'Public Website Contact Sales', marker: 'Contact Sales' },
];
