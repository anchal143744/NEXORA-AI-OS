export type MarketplaceStatus = 'featured' | 'verified' | 'active' | 'beta' | 'review';
export type PartnerType = 'Implementation Partner' | 'Technology Partner' | 'Consulting Partner' | 'Reseller Partner';
export type CertificationType = 'Certified App' | 'Certified Integration' | 'Certified Partner' | 'Certified AI Agent';

export interface EcosystemMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  description: string;
  appCount: number;
}

export interface MarketplaceListing {
  id: string;
  name: string;
  category: string;
  publisher: string;
  rating: number;
  installs: string;
  installTime: string;
  status: MarketplaceStatus;
  summary: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  owner: string;
  verification: MarketplaceStatus;
  rating: number;
  updatePolicy: string;
  capability: string;
}

export interface IntegrationConnector {
  id: string;
  name: string;
  category: string;
  auth: string;
  sync: string;
  status: MarketplaceStatus;
}

export interface PartnerProgram {
  id: string;
  name: string;
  type: PartnerType;
  revenueShare: string;
  certification: string;
  growthSignal: string;
}

export interface DeveloperResource {
  id: string;
  title: string;
  audience: string;
  format: string;
  summary: string;
}

export interface DeveloperConsoleItem {
  id: string;
  name: string;
  control: string;
  audit: string;
  status: MarketplaceStatus;
}

export interface ExtensionCapability {
  id: string;
  name: string;
  surface: string;
  governance: string;
  summary: string;
}

export interface MarketplaceBillingPlan {
  id: string;
  name: string;
  model: string;
  revenueShare: string;
  payoutCadence: string;
  controls: string;
}

export interface MarketplaceAnalyticsSignal {
  id: string;
  metric: string;
  value: string;
  trend: string;
  insight: string;
}

export interface CertificationProgram {
  id: string;
  name: CertificationType;
  requirements: string;
  reviewer: string;
  status: MarketplaceStatus;
}

export interface EcosystemInsight {
  id: string;
  title: string;
  signal: string;
  recommendation: string;
  impact: string;
}

export interface EcosystemCopilotCommand {
  id: string;
  command: string;
  response: string;
}

export interface EcosystemRoute {
  path: string;
  module: string;
  marker: string;
}
