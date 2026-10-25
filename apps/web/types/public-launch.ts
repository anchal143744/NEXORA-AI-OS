export type LaunchStatus = 'ready' | 'active' | 'watch' | 'blocked';
export type PricingTier = 'Starter' | 'Growth' | 'Business' | 'Enterprise' | 'AI Enterprise';

export interface LaunchMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface LaunchChecklistItem {
  id: string;
  title: string;
  owner: string;
  status: LaunchStatus;
  evidence: string;
}

export interface LaunchMilestone {
  id: string;
  milestone: string;
  target: string;
  status: LaunchStatus;
  dependency: string;
}

export interface LaunchRisk {
  id: string;
  risk: string;
  severity: string;
  mitigation: string;
  status: LaunchStatus;
}

export interface PricingPlan {
  id: string;
  name: PricingTier;
  audience: string;
  monthlyPrice: string;
  usageLimit: string;
  billingIntegration: string;
  features: string[];
}

export interface TrialExperienceStep {
  id: string;
  step: string;
  outcome: string;
  metric: string;
  status: LaunchStatus;
}

export interface MarketingMessage {
  id: string;
  area: string;
  headline: string;
  proof: string;
}

export interface AcquisitionSignal {
  id: string;
  channel: string;
  leads: string;
  signups: string;
  conversions: string;
  revenue: string;
}

export interface SalesEnablementAsset {
  id: string;
  asset: string;
  audience: string;
  outcome: string;
  status: LaunchStatus;
}

export interface PublicWebsitePage {
  id: string;
  label: string;
  path: string;
  promise: string;
  primaryCta: string;
}

export interface CustomerSuccessLaunchItem {
  id: string;
  program: string;
  metric: string;
  owner: string;
  status: LaunchStatus;
}

export interface GlobalReadinessCheck {
  id: string;
  domain: string;
  score: number;
  validation: string;
  status: LaunchStatus;
}

export interface AdoptionIntelligenceSignal {
  id: string;
  metric: string;
  value: string;
  trend: string;
  recommendation: string;
}

export interface LaunchAnalyticsSignal {
  id: string;
  metric: string;
  value: string;
  trend: string;
  insight: string;
}

export interface ExecutiveWarRoomSignal {
  id: string;
  signal: string;
  value: string;
  interpretation: string;
  action: string;
}

export interface LaunchCopilotCommand {
  id: string;
  command: string;
  response: string;
}

export interface PublicLaunchRoute {
  path: string;
  module: string;
  marker: string;
}
