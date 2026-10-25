export type TrustStatus = 'ready' | 'watch' | 'blocked';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type ComplianceFramework = 'SOC 2' | 'ISO 27001' | 'GDPR' | 'HIPAA' | 'PCI DSS';

export interface TrustMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface SecurityFinding {
  id: string;
  title: string;
  severity: Severity;
  owner: string;
  status: TrustStatus;
  remediation: string;
}

export interface VulnerabilitySignal {
  id: string;
  source: string;
  category: string;
  score: number;
  workflow: string;
  validation: string;
}

export interface SecurityEvent {
  id: string;
  event: string;
  riskScore: number;
  trend: string;
  status: TrustStatus;
}

export interface ComplianceControl {
  id: string;
  framework: ComplianceFramework;
  control: string;
  status: TrustStatus;
  evidence: string;
}

export interface TrustCenterDocument {
  id: string;
  title: string;
  audience: string;
  status: TrustStatus;
  summary: string;
}

export interface PrivacyControl {
  id: string;
  area: string;
  policy: string;
  status: TrustStatus;
  owner: string;
}

export interface DataProtectionControl {
  id: string;
  control: string;
  validation: string;
  status: TrustStatus;
  evidence: string;
}

export interface EnterpriseRisk {
  id: string;
  risk: string;
  score: number;
  mitigation: string;
  monitoring: string;
}

export interface IncidentPlan {
  id: string;
  severity: Severity;
  responsePlan: string;
  status: TrustStatus;
  postMortem: string;
}

export interface EvidenceItem {
  id: string;
  type: string;
  title: string;
  owner: string;
  retention: string;
}

export interface VendorSecurityReview {
  id: string;
  vendor: string;
  risk: Severity;
  compliance: string;
  nextReview: string;
}

export interface AiSecurityCheck {
  id: string;
  domain: string;
  validation: string;
  status: TrustStatus;
  evidence: string;
}

export interface EnterpriseTrustRoute {
  path: string;
  module: string;
  marker: string;
}
