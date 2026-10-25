import type {
  AdoptionMetric,
  AiCustomerSuccessCommand,
  BetaCohort,
  CommunityThread,
  CustomerSuccessAccount,
  FeatureRequest,
  FeedbackSignal,
  GtmReadinessGate,
  InAppFeedbackChannel,
  NpsSegment,
  OnboardingMilestone,
  ProductTour,
  PublicBetaMetric,
  PublicBetaRoute,
} from '@/types/public-beta';

export const publicBetaMetrics: PublicBetaMetric[] = [
  { id: 'active-testers', label: 'Active Testers', value: '240', detail: 'Beta cohort capacity across startup, agency, ecommerce and enterprise profiles.' },
  { id: 'engagement', label: 'Engagement', value: '68%', detail: 'Weekly active beta users completing guided workflows and feedback loops.' },
  { id: 'feedback-volume', label: 'Feedback Volume', value: '412', detail: 'Product, UX, feature, bug and improvement signals ready for triage.' },
  { id: 'time-to-value', label: 'Time To Value', value: '<10m', detail: 'Customer onboarding is designed to reach first workspace activation in under ten minutes.' },
  { id: 'nps-score', label: 'NPS Score', value: '47', detail: 'Public beta satisfaction benchmark with segment-level drivers.' },
];

export const betaCohorts: BetaCohort[] = [
  { id: 'founders', name: 'Founder Operators', testers: 72, engagement: 74, feedbackVolume: 116, featureUsage: 'Command Center, CRM, AI Agents', status: 'ready' },
  { id: 'agencies', name: 'Growth Agencies', testers: 48, engagement: 71, feedbackVolume: 94, featureUsage: 'CRM, Projects, Analytics', status: 'ready' },
  { id: 'commerce', name: 'Commerce Teams', testers: 54, engagement: 63, feedbackVolume: 88, featureUsage: 'Finance, Inventory, Customer Experience', status: 'watch' },
  { id: 'enterprise', name: 'Enterprise Ops', testers: 66, engagement: 64, feedbackVolume: 114, featureUsage: 'Security, Analytics, Production Ops', status: 'ready' },
];

export const onboardingMilestones: OnboardingMilestone[] = [
  { id: 'organization', title: 'Organization setup', targetMinute: 2, completionRate: 91, owner: 'Customer Onboarding' },
  { id: 'team', title: 'Team invitations', targetMinute: 4, completionRate: 78, owner: 'Customer Onboarding' },
  { id: 'configuration', title: 'Guided configuration', targetMinute: 6, completionRate: 74, owner: 'Implementation Success' },
  { id: 'workspace', title: 'Workspace activation', targetMinute: 8, completionRate: 69, owner: 'Workspace Intelligence' },
  { id: 'milestone', title: 'First success milestone', targetMinute: 10, completionRate: 62, owner: 'Customer Success' },
];

export const productTours: ProductTour[] = [
  { id: 'crm', workspace: 'CRM Tour', duration: '4 minutes', checkpoints: ['Lead capture', 'Pipeline health', 'AI next action'], activationGoal: 'Create or qualify first lead' },
  { id: 'hr', workspace: 'HR Tour', duration: '4 minutes', checkpoints: ['Employee directory', 'Leave requests', 'AI HR insights'], activationGoal: 'Invite first team member' },
  { id: 'finance', workspace: 'Finance Tour', duration: '5 minutes', checkpoints: ['Revenue overview', 'Invoices', 'Cash flow intelligence'], activationGoal: 'Review first finance insight' },
  { id: 'ai-agents', workspace: 'AI Agents Tour', duration: '5 minutes', checkpoints: ['Agent template', 'Permissions', 'Monitoring'], activationGoal: 'Preview first recommended agent' },
  { id: 'analytics', workspace: 'Analytics Tour', duration: '5 minutes', checkpoints: ['Company health', 'KPIs', 'Strategic risks'], activationGoal: 'Open executive scorecard' },
];

export const feedbackSignals: FeedbackSignal[] = [
  { id: 'ux-setup', source: 'In-app feedback', category: 'UX Feedback', sentiment: 'positive', priority: 'high', impact: 'Improves onboarding completion', action: 'Simplify workspace activation copy' },
  { id: 'feature-ai', source: 'Feature request portal', category: 'Feature Requests', sentiment: 'positive', priority: 'critical', impact: 'High enterprise conversion signal', action: 'Prioritize AI setup checklist templates' },
  { id: 'bug-mobile', source: 'Bug report', category: 'Bug Reports', sentiment: 'negative', priority: 'high', impact: 'Mobile onboarding friction', action: 'Route to mobile optimization queue' },
  { id: 'improvement-tours', source: 'Community thread', category: 'Improvement Suggestions', sentiment: 'neutral', priority: 'medium', impact: 'Better product comprehension', action: 'Add contextual tour branching by role' },
];

export const customerSuccessAccounts: CustomerSuccessAccount[] = [
  { id: 'northstar', name: 'Northstar Agency', healthScore: 88, onboardingProgress: 92, risk: 'low', nextAction: 'Invite finance stakeholder' },
  { id: 'atlas', name: 'Atlas Commerce', healthScore: 72, onboardingProgress: 68, risk: 'medium', nextAction: 'Schedule inventory workflow walkthrough' },
  { id: 'veridian', name: 'Veridian Ops', healthScore: 64, onboardingProgress: 58, risk: 'watch', nextAction: 'Escalate executive onboarding call' },
  { id: 'lumos', name: 'Lumos SaaS', healthScore: 91, onboardingProgress: 96, risk: 'low', nextAction: 'Collect launch testimonial' },
];

export const adoptionMetrics: AdoptionMetric[] = [
  { id: 'active-users', label: 'Active Users', value: '1,284', trend: '+18%', insight: 'Command Center and CRM are driving the strongest beta engagement.' },
  { id: 'feature-adoption', label: 'Feature Adoption', value: '57%', trend: '+12%', insight: 'AI Agents templates create the fastest aha moment after workspace setup.' },
  { id: 'engagement-rate', label: 'Engagement Rate', value: '68%', trend: '+9%', insight: 'Guided tours lift second-session activation across HR and Finance.' },
  { id: 'retention-rate', label: 'Retention Rate', value: '81%', trend: '+6%', insight: 'Accounts with AI setup completed retain at materially higher rates.' },
  { id: 'time-to-value', label: 'Time To Value', value: '8.4m', trend: '-1.6m', insight: 'The under-10-minute onboarding rule is currently met.' },
];

export const featureRequests: FeatureRequest[] = [
  { id: 'smart-imports', title: 'AI-assisted import mapping', votes: 184, priority: 'critical', roadmapStage: 'Discovery', businessImpact: 'Accelerates customer onboarding from legacy tools' },
  { id: 'tour-branching', title: 'Role-based product tour branching', votes: 139, priority: 'high', roadmapStage: 'Queued', businessImpact: 'Improves comprehension without documentation' },
  { id: 'executive-pack', title: 'Executive beta summary pack', votes: 118, priority: 'high', roadmapStage: 'Review', businessImpact: 'Helps champions sell internally' },
  { id: 'community-ama', title: 'In-app beta community AMA room', votes: 92, priority: 'medium', roadmapStage: 'Backlog', businessImpact: 'Converts feedback into community momentum' },
];

export const inAppFeedbackChannels: InAppFeedbackChannel[] = [
  { id: 'quick', channel: 'Quick Feedback', captureMode: 'One-tap sentiment and comment', routing: 'Feedback triage queue', responseTarget: '24 hours' },
  { id: 'screenshot', channel: 'Screenshot Feedback', captureMode: 'Annotated screen context', routing: 'UX and bug review', responseTarget: '48 hours' },
  { id: 'issue', channel: 'Issue Reporting', captureMode: 'Severity, module and reproduction detail', routing: 'Engineering triage', responseTarget: '1 business day' },
  { id: 'suggestion', channel: 'Feature Suggestions', captureMode: 'Problem, use case and expected impact', routing: 'Product discovery', responseTarget: '3 business days' },
];

export const npsSegments: NpsSegment[] = [
  { id: 'founders', segment: 'Founder Operators', score: 58, satisfaction: 'High', driver: 'AI command center and fast setup' },
  { id: 'agencies', segment: 'Growth Agencies', score: 52, satisfaction: 'High', driver: 'CRM and analytics clarity' },
  { id: 'commerce', segment: 'Commerce Teams', score: 39, satisfaction: 'Medium', driver: 'Needs richer inventory onboarding' },
  { id: 'enterprise', segment: 'Enterprise Ops', score: 44, satisfaction: 'Medium High', driver: 'Trust in deployment and security readiness' },
];

export const communityThreads: CommunityThread[] = [
  { id: 'roadmap', topic: 'What should be in the beta roadmap?', replies: 47, owner: 'Product', signal: 'Feature prioritization' },
  { id: 'setup', topic: 'Share your workspace setup flow', replies: 31, owner: 'Customer Success', signal: 'Onboarding friction' },
  { id: 'ai-agents', topic: 'AI agent templates for your industry', replies: 54, owner: 'AI Product', signal: 'Template demand' },
  { id: 'release', topic: 'Weekly product update discussion', replies: 26, owner: 'Launch Team', signal: 'Launch messaging clarity' },
];

export const gtmReadinessGates: GtmReadinessGate[] = [
  { id: 'positioning', gate: 'Product positioning', owner: 'GTM Strategy', status: 'ready', evidence: 'Adaptive AI Business OS positioning tested with beta cohorts.' },
  { id: 'messaging', gate: 'Messaging', owner: 'Product Marketing', status: 'ready', evidence: 'Enterprise, startup, agency and commerce messaging variants prepared.' },
  { id: 'journey', gate: 'Customer journey', owner: 'Growth', status: 'ready', evidence: 'Awareness to activation journey mapped to onboarding milestones.' },
  { id: 'pricing', gate: 'Pricing readiness', owner: 'Revenue Operations', status: 'watch', evidence: 'Pricing packaging ready for beta validation before GA.' },
  { id: 'trial', gate: 'Trial experience', owner: 'Customer Success', status: 'ready', evidence: 'Guided setup, demo workspaces and success milestones are in place.' },
];

export const aiCustomerSuccessCommands: AiCustomerSuccessCommand[] = [
  { id: 'progress', command: 'Show onboarding progress', responseFocus: 'Milestones, blockers and time-to-value', action: 'Recommend next activation step' },
  { id: 'risk', command: 'Identify at-risk customers', responseFocus: 'Health score, engagement and sentiment', action: 'Create success intervention plan' },
  { id: 'requests', command: 'Show top feature requests', responseFocus: 'Votes, priority and roadmap impact', action: 'Rank product priorities' },
  { id: 'sentiment', command: 'Analyze customer sentiment', responseFocus: 'NPS, feedback tone and community threads', action: 'Summarize customer mood' },
  { id: 'improve', command: 'Recommend onboarding improvements', responseFocus: 'Drop-offs, tour completion and success milestones', action: 'Propose onboarding experiment' },
  { id: 'priorities', command: 'Suggest product priorities', responseFocus: 'Impact, urgency and conversion signal', action: 'Generate product decision brief' },
];

export const publicBetaNavigation = [
  { group: 'Beta', items: ['Applications', 'Invitations', 'Cohorts', 'Analytics'] },
  { group: 'Adoption', items: ['Onboarding', 'Tours', 'Success', 'Feature Requests'] },
  { group: 'Launch', items: ['Feedback', 'NPS', 'Community', 'GTM Readiness', 'AI Copilot'] },
];

export const phase62Routes: PublicBetaRoute[] = [
  { path: '/public-beta', module: 'Public Beta Workspace', marker: 'Public Beta Management' },
  { path: '/public-beta/beta-management', module: 'Public Beta Management', marker: 'Active Testers' },
  { path: '/public-beta/onboarding', module: 'Customer Onboarding Center', marker: 'under ten minutes' },
  { path: '/public-beta/product-tours', module: 'Guided Product Tours', marker: 'CRM Tour' },
  { path: '/public-beta/feedback-intelligence', module: 'Feedback Intelligence Platform', marker: 'Sentiment' },
  { path: '/public-beta/customer-success', module: 'Customer Success Workspace', marker: 'Customer Health Scores' },
  { path: '/public-beta/adoption-analytics', module: 'Product Adoption Analytics', marker: 'Time To Value' },
  { path: '/public-beta/feature-requests', module: 'Feature Request Portal', marker: 'Voting' },
  { path: '/public-beta/in-app-feedback', module: 'In-App Feedback System', marker: 'Screenshot Feedback' },
  { path: '/public-beta/nps', module: 'NPS & Customer Satisfaction', marker: 'NPS Score' },
  { path: '/public-beta/community', module: 'Beta Community Hub', marker: 'Discussions' },
  { path: '/public-beta/go-to-market', module: 'Go-To-Market Readiness Center', marker: 'Product positioning' },
  { path: '/public-beta/copilot', module: 'AI Customer Success Copilot', marker: 'Show onboarding progress' },
  { path: '/workspace/public-beta', module: 'Public Beta compatibility route', marker: 'Public Beta Management' },
];
