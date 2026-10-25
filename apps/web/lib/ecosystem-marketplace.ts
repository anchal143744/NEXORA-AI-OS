import type {
  AgentTemplate,
  CertificationProgram,
  DeveloperConsoleItem,
  DeveloperResource,
  EcosystemCopilotCommand,
  EcosystemInsight,
  EcosystemMetric,
  EcosystemRoute,
  ExtensionCapability,
  IntegrationConnector,
  MarketplaceAnalyticsSignal,
  MarketplaceBillingPlan,
  MarketplaceCategory,
  MarketplaceListing,
  PartnerProgram,
} from '@/types/ecosystem-marketplace';

export const ecosystemMetrics: EcosystemMetric[] = [
  { id: 'marketplace-apps', label: 'Marketplace Apps', value: '128', detail: 'Verified apps, integrations, templates and industry solutions discoverable by tenants.' },
  { id: 'verified-agents', label: 'Verified AI Agents', value: '24', detail: 'AI agents with permission boundaries, version control and certification metadata.' },
  { id: 'active-partners', label: 'Active Partners', value: '46', detail: 'Implementation, technology, consulting and reseller partners in the ecosystem.' },
  { id: 'monthly-installs', label: 'Installs This Month', value: '3.1k', detail: 'Tenant-scoped installs with two-minute guided activation and rollback controls.' },
  { id: 'marketplace-revenue', label: 'Marketplace Revenue', value: '$186k', detail: 'Subscription, usage and revenue-share billing tracked across partner applications.' },
  { id: 'developer-apps', label: 'Developer Apps', value: '72', detail: 'Developer console applications with API keys, OAuth apps, webhooks and logs.' },
];

export const marketplaceCategories: MarketplaceCategory[] = [
  { id: 'crm', name: 'CRM', description: 'Customer workflows, pipeline automation and revenue operations extensions.', appCount: 18 },
  { id: 'hr', name: 'HR', description: 'People operations, hiring, learning and workforce intelligence apps.', appCount: 14 },
  { id: 'finance', name: 'Finance', description: 'Billing, revenue, invoicing, forecasting and FinOps extensions.', appCount: 16 },
  { id: 'analytics', name: 'Analytics', description: 'BI dashboards, semantic metrics and executive intelligence packages.', appCount: 15 },
  { id: 'ai-agents', name: 'AI Agents', description: 'Verified agents for sales, HR, finance, support and operations.', appCount: 24 },
  { id: 'automation', name: 'Automation', description: 'Workflow packs, event hooks and approval automation bundles.', appCount: 17 },
  { id: 'integrations', name: 'Integrations', description: 'Enterprise connectors for systems of record and communication tools.', appCount: 19 },
  { id: 'industry-solutions', name: 'Industry Solutions', description: 'Packaged templates for healthcare, manufacturing, retail and services.', appCount: 5 },
];

export const marketplaceListings: MarketplaceListing[] = [
  { id: 'salesforce-sync', name: 'Salesforce Revenue Sync', category: 'Integrations', publisher: 'NEXORA Connect', rating: 4.8, installs: '812', installTime: '< 2 min', status: 'verified', summary: 'Bi-directional CRM and opportunity synchronization with approval-aware field mapping.' },
  { id: 'pipeline-optimizer', name: 'Pipeline Optimizer', category: 'CRM', publisher: 'RevOps Labs', rating: 4.7, installs: '544', installTime: '< 2 min', status: 'featured', summary: 'AI prioritization for deals, stale opportunities and next best sales actions.' },
  { id: 'people-pulse', name: 'People Pulse', category: 'HR', publisher: 'Talent Works', rating: 4.6, installs: '386', installTime: '< 2 min', status: 'verified', summary: 'Employee engagement, skill gap and retention signal tracking for people teams.' },
  { id: 'cashflow-watch', name: 'Cashflow Watch', category: 'Finance', publisher: 'Ledgerline', rating: 4.9, installs: '601', installTime: '< 2 min', status: 'featured', summary: 'Cash position, invoice risk and collection recommendations for finance leaders.' },
  { id: 'executive-kpi-pack', name: 'Executive KPI Pack', category: 'Analytics', publisher: 'NEXORA BI', rating: 4.8, installs: '734', installTime: '< 2 min', status: 'verified', summary: 'Cross-module KPI cards, scorecards and board-ready executive views.' },
];

export const agentTemplates: AgentTemplate[] = [
  { id: 'sales-assistant', name: 'Sales Assistant Agent', owner: 'NEXORA AI', verification: 'verified', rating: 4.9, updatePolicy: 'Monthly verified updates', capability: 'Lead qualification, follow-ups, deal risk and forecast support.' },
  { id: 'hr-recruiter', name: 'HR Recruiter Agent', owner: 'NEXORA AI', verification: 'verified', rating: 4.8, updatePolicy: 'Quarterly skill model review', capability: 'Candidate screening, interview summaries and hiring recommendations.' },
  { id: 'finance-analyst', name: 'Finance Analyst Agent', owner: 'NEXORA AI', verification: 'verified', rating: 4.8, updatePolicy: 'Monthly finance policy review', capability: 'Invoice analysis, budget variance and cash flow explanations.' },
  { id: 'customer-success', name: 'Customer Success Agent', owner: 'SuccessOps Studio', verification: 'review', rating: 4.5, updatePolicy: 'Partner review required', capability: 'Health scoring, churn risk and renewal action plans.' },
  { id: 'forecasting', name: 'Forecasting Agent', owner: 'NEXORA Forecast', verification: 'verified', rating: 4.7, updatePolicy: 'Model performance validation', capability: 'Revenue, demand and workforce forecast explanations.' },
];

export const applicationLifecycle: MarketplaceListing[] = [
  { id: 'third-party-apps', name: 'Third-Party Apps', category: 'Applications', publisher: 'Partner Ecosystem', rating: 4.7, installs: '1.8k', installTime: '< 2 min', status: 'active', summary: 'Externally published applications with versioning, reviews and tenant install controls.' },
  { id: 'internal-apps', name: 'Internal Apps', category: 'Applications', publisher: 'Enterprise Admins', rating: 4.6, installs: '920', installTime: '< 2 min', status: 'active', summary: 'Private tenant applications distributed to approved workspaces.' },
  { id: 'app-publishing', name: 'App Publishing', category: 'Developer Platform', publisher: 'Developer Console', rating: 4.8, installs: '314', installTime: '< 2 min', status: 'beta', summary: 'Submission, review, rollout and rollback workflow for marketplace publishers.' },
  { id: 'version-management', name: 'Version Management', category: 'Developer Platform', publisher: 'Release Governance', rating: 4.8, installs: '487', installTime: '< 2 min', status: 'verified', summary: 'Semantic versioning, changelog controls and tenant-safe update channels.' },
];

export const integrationConnectors: IntegrationConnector[] = [
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', auth: 'OAuth2', sync: 'Bi-directional records and events', status: 'verified' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', auth: 'OAuth2', sync: 'Contacts, deals and timeline activity', status: 'verified' },
  { id: 'sap', name: 'SAP', category: 'ERP', auth: 'OAuth2 and service credentials', sync: 'Finance, procurement and manufacturing records', status: 'review' },
  { id: 'oracle', name: 'Oracle', category: 'ERP', auth: 'OAuth2 and signed requests', sync: 'Financials, orders and master data', status: 'review' },
  { id: 'slack', name: 'Slack', category: 'Communication', auth: 'OAuth2', sync: 'Notifications, approvals and channel events', status: 'verified' },
  { id: 'teams', name: 'Teams', category: 'Communication', auth: 'Microsoft OAuth', sync: 'Meetings, messages and approvals', status: 'verified' },
  { id: 'zoom', name: 'Zoom', category: 'Meetings', auth: 'OAuth2', sync: 'Meetings, transcripts and summaries', status: 'active' },
  { id: 'stripe', name: 'Stripe', category: 'Payments', auth: 'Restricted API keys', sync: 'Subscriptions, invoices and payment events', status: 'verified' },
  { id: 'aws', name: 'AWS', category: 'Cloud', auth: 'IAM role federation', sync: 'Storage, events and operational telemetry', status: 'active' },
  { id: 'azure', name: 'Azure', category: 'Cloud', auth: 'Azure AD OAuth', sync: 'Identity, storage and infrastructure signals', status: 'active' },
  { id: 'google-workspace', name: 'Google Workspace', category: 'Productivity', auth: 'Google OAuth', sync: 'Calendar, Drive and collaboration records', status: 'verified' },
];

export const partnerPrograms: PartnerProgram[] = [
  { id: 'implementation', name: 'Implementation Partners', type: 'Implementation Partner', revenueShare: '20% services attach tracking', certification: 'Certified Partner path', growthSignal: 'Fast onboarding for enterprise deployments.' },
  { id: 'technology', name: 'Technology Partners', type: 'Technology Partner', revenueShare: '15% marketplace revenue share', certification: 'Certified App and Integration path', growthSignal: 'Connector and app publishing acceleration.' },
  { id: 'consulting', name: 'Consulting Partners', type: 'Consulting Partner', revenueShare: 'Referral and delivery attribution', certification: 'Certified Partner path', growthSignal: 'Industry solution packaging and advisory programs.' },
  { id: 'reseller', name: 'Reseller Partners', type: 'Reseller Partner', revenueShare: 'Tiered reseller margin', certification: 'Commercial readiness review', growthSignal: 'Regional customer acquisition and renewals.' },
];

export const developerResources: DeveloperResource[] = [
  { id: 'sdk-docs', title: 'SDK Documentation', audience: 'Developers', format: 'Guides and SDK references', summary: 'Typed extension SDKs for modules, workflows, dashboards and AI agents.' },
  { id: 'api-docs', title: 'API Documentation', audience: 'Platform teams', format: 'OpenAPI hub', summary: 'Versioned REST APIs, rate limits, auth examples and webhook contracts.' },
  { id: 'sandbox', title: 'Sandbox Environments', audience: 'Partners', format: 'Tenant-safe sandboxes', summary: 'Isolated developer tenants for install tests, OAuth validation and sample data.' },
  { id: 'resources', title: 'Developer Resources', audience: 'Builders', format: 'Patterns and examples', summary: 'Security, billing, publishing and review checklists for marketplace releases.' },
];

export const developerConsoleItems: DeveloperConsoleItem[] = [
  { id: 'api-keys', name: 'API Keys', control: 'Scoped keys with rotation, usage and audit trails.', audit: 'Key creation, rotation, revocation and permission changes.', status: 'verified' },
  { id: 'oauth-apps', name: 'OAuth Apps', control: 'Redirect URI, consent screen and approval workflow management.', audit: 'Client updates, secret rotation and install approvals.', status: 'active' },
  { id: 'webhooks', name: 'Webhooks', control: 'Signed outbound webhooks with replay protection and retries.', audit: 'Delivery attempts, failures and subscription changes.', status: 'verified' },
  { id: 'usage-analytics', name: 'Usage Analytics', control: 'API calls, installs, errors, latency and revenue impact.', audit: 'Usage exports and billing reconciliation history.', status: 'active' },
  { id: 'logs', name: 'Logs', control: 'Developer-visible request, webhook and install logs.', audit: 'Tenant-safe redaction and retention policies.', status: 'active' },
];

export const extensionCapabilities: ExtensionCapability[] = [
  { id: 'custom-modules', name: 'Custom Modules', surface: 'Workspace navigation and module registry', governance: 'RBAC, tenant isolation and certification review', summary: 'Partners can publish industry modules that appear in adaptive workspaces.' },
  { id: 'custom-workflows', name: 'Custom Workflows', surface: 'Workflow builder and event bus', governance: 'Approval policies, retry rules and event audit', summary: 'Extensions can add workflow actions, triggers and reusable automation packs.' },
  { id: 'custom-dashboards', name: 'Custom Dashboards', surface: 'Analytics and command center', governance: 'Metric permissions and secure retrieval', summary: 'Dashboard extensions expose certified metrics and tenant-scoped widgets.' },
  { id: 'custom-ai-agents', name: 'Custom AI Agents', surface: 'AI agent marketplace and execution layer', governance: 'Capability permissions, approvals and AI audit logs', summary: 'Developers can package agents with tools, prompts, memory boundaries and updates.' },
];

export const marketplaceBillingPlans: MarketplaceBillingPlan[] = [
  { id: 'subscription', name: 'Subscription Billing', model: 'Monthly and annual app plans', revenueShare: 'Standard partner split', payoutCadence: 'Monthly', controls: 'Tenant installs, renewals, cancellation and entitlement checks.' },
  { id: 'usage', name: 'Usage Billing', model: 'Metered API, agent and automation usage', revenueShare: 'Usage-based partner split', payoutCadence: 'Monthly', controls: 'Usage events, quotas, overages and reconciliation reports.' },
  { id: 'payouts', name: 'Partner Payouts', model: 'Revenue share payouts', revenueShare: 'Tiered by partner program', payoutCadence: 'Monthly with holdback', controls: 'Payout approvals, tax metadata and audit trails.' },
  { id: 'enterprise', name: 'Enterprise Marketplace Contracts', model: 'Private offers and negotiated pricing', revenueShare: 'Contract specific', payoutCadence: 'Contractual', controls: 'Private plans, procurement approvals and contract records.' },
];

export const marketplaceAnalyticsSignals: MarketplaceAnalyticsSignal[] = [
  { id: 'installs', metric: 'Installs', value: '3.1k', trend: '+18%', insight: 'AI agents and CRM integrations drive the highest install momentum.' },
  { id: 'revenue', metric: 'Revenue', value: '$186k', trend: '+24%', insight: 'Usage billing and private enterprise plans are expanding partner revenue.' },
  { id: 'active-apps', metric: 'Active Apps', value: '128', trend: '+12', insight: 'Certified integrations and industry templates are expanding catalog depth.' },
  { id: 'partner-growth', metric: 'Partner Growth', value: '46 partners', trend: '+9%', insight: 'Implementation partners are growing fastest in regulated industries.' },
  { id: 'adoption', metric: 'User Adoption', value: '68%', trend: '+11%', insight: 'Two-minute install flows are improving workspace adoption.' },
];

export const certificationPrograms: CertificationProgram[] = [
  { id: 'certified-app', name: 'Certified App', requirements: 'Security review, accessibility, support SLA, rollback and versioning checks.', reviewer: 'Marketplace Review Board', status: 'verified' },
  { id: 'certified-integration', name: 'Certified Integration', requirements: 'OAuth, webhook signing, replay protection, rate limit and sync validation.', reviewer: 'Connectivity Review Board', status: 'verified' },
  { id: 'certified-partner', name: 'Certified Partner', requirements: 'Partner profile, delivery evidence, support process and customer references.', reviewer: 'Partner Operations', status: 'active' },
  { id: 'certified-ai-agent', name: 'Certified AI Agent', requirements: 'Prompt review, model governance, permissions, approvals and AI audit trail.', reviewer: 'AI Governance Board', status: 'review' },
];

export const ecosystemInsights: EcosystemInsight[] = [
  { id: 'top-apps', title: 'Top Apps', signal: 'Executive KPI Pack, Cashflow Watch and Salesforce Revenue Sync lead installs.', recommendation: 'Feature these apps in enterprise onboarding bundles.', impact: 'Higher time-to-value for new tenants.' },
  { id: 'fastest-growing', title: 'Fastest Growing Apps', signal: 'Finance and AI agent categories are accelerating month over month.', recommendation: 'Prioritize certification lanes for finance analysts and forecasting agents.', impact: 'Higher marketplace revenue and adoption.' },
  { id: 'ecosystem-health', title: 'Ecosystem Health', signal: 'Catalog depth, partner coverage and install conversion are healthy.', recommendation: 'Expand industry templates and partner enablement for regulated markets.', impact: 'Stronger enterprise expansion readiness.' },
  { id: 'revenue-trends', title: 'Revenue Trends', signal: 'Private enterprise plans are growing faster than self-service app plans.', recommendation: 'Add procurement-ready private offer workflows.', impact: 'Improved enterprise deal capture.' },
  { id: 'partner-performance', title: 'Partner Performance', signal: 'Implementation partners have the strongest customer activation outcomes.', recommendation: 'Route enterprise beta customers to certified implementation partners.', impact: 'Reduced onboarding risk.' },
];

export const ecosystemCopilotCommands: EcosystemCopilotCommand[] = [
  { id: 'top-marketplace-apps', command: 'Show top marketplace apps', response: 'Rank apps by installs, ratings, revenue and tenant adoption.' },
  { id: 'partner-growth', command: 'Show partner growth', response: 'Summarize partner additions, certifications and revenue contribution.' },
  { id: 'recommend-integrations', command: 'Recommend integrations', response: 'Use workspace profile and enabled modules to suggest connectors.' },
  { id: 'marketplace-revenue', command: 'Analyze marketplace revenue', response: 'Explain subscription, usage and private offer revenue trends.' },
  { id: 'ecosystem-health', command: 'Show ecosystem health', response: 'Score catalog quality, install conversion, partner performance and support readiness.' },
];

export const ecosystemMarketplaceNavigation = [
  { group: 'Marketplace', items: ['Marketplace Home', 'Apps', 'AI Agents', 'Integrations'] },
  { group: 'Partners', items: ['Partner Portal', 'Revenue Sharing', 'Certification', 'Analytics'] },
  { group: 'Developers', items: ['Developer Platform', 'Developer Console', 'Extension Framework', 'AI Ecosystem Copilot'] },
];

export const phase64Routes: EcosystemRoute[] = [
  { path: '/ecosystem-marketplace', module: 'Ecosystem Marketplace Workspace', marker: 'Marketplace Search' },
  { path: '/ecosystem-marketplace/enterprise-marketplace', module: 'Enterprise Marketplace', marker: 'Featured Apps' },
  { path: '/ecosystem-marketplace/ai-agent-marketplace', module: 'AI Agent Marketplace', marker: 'Agent Templates' },
  { path: '/ecosystem-marketplace/applications', module: 'Application Marketplace', marker: 'Third-Party Apps' },
  { path: '/ecosystem-marketplace/integrations', module: 'Integration Marketplace', marker: 'Salesforce' },
  { path: '/ecosystem-marketplace/partners', module: 'Partner Portal', marker: 'Partner Registration' },
  { path: '/ecosystem-marketplace/developer-platform', module: 'Developer Platform', marker: 'SDK Documentation' },
  { path: '/ecosystem-marketplace/developer-console', module: 'Developer Console', marker: 'API Keys' },
  { path: '/ecosystem-marketplace/extensions', module: 'Extension Framework', marker: 'Custom Modules' },
  { path: '/ecosystem-marketplace/billing', module: 'Marketplace Billing', marker: 'Revenue Sharing' },
  { path: '/ecosystem-marketplace/analytics', module: 'Marketplace Analytics', marker: 'Installs' },
  { path: '/ecosystem-marketplace/certification', module: 'Certification Program', marker: 'Certified App' },
  { path: '/ecosystem-marketplace/intelligence', module: 'Ecosystem Intelligence Center', marker: 'Ecosystem Health' },
  { path: '/ecosystem-marketplace/copilot', module: 'AI Ecosystem Copilot', marker: 'Show top marketplace apps' },
  { path: '/workspace/ecosystem-marketplace', module: 'Ecosystem Marketplace compatibility route', marker: 'Marketplace Search' },
];
