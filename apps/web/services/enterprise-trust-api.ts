import {
  aiSecurityChecks,
  complianceControls,
  dataProtectionControls,
  enterpriseRisks,
  evidenceItems,
  incidentPlans,
  privacyControls,
  securityEvents,
  securityFindings,
  trustCenterDocuments,
  trustMetrics,
  vendorSecurityReviews,
  vulnerabilitySignals,
} from '@/lib/enterprise-trust';

export async function getEnterpriseTrustSnapshot() {
  return {
    metrics: trustMetrics,
    findings: securityFindings,
    vulnerabilities: vulnerabilitySignals,
    securityEvents,
    compliance: complianceControls,
    trustCenter: trustCenterDocuments,
    privacy: privacyControls,
    dataProtection: dataProtectionControls,
    risks: enterpriseRisks,
    incidents: incidentPlans,
    evidence: evidenceItems,
    vendors: vendorSecurityReviews,
    aiSecurity: aiSecurityChecks,
    generatedAt: new Date().toISOString(),
  };
}

export const enterpriseTrustEndpoints = {
  securityAudit: '/v1/enterprise-trust/security-audit',
  vulnerabilities: '/v1/enterprise-trust/vulnerabilities',
  securityOperations: '/v1/enterprise-trust/security-operations',
  compliance: '/v1/enterprise-trust/compliance',
  trustCenter: '/v1/trust-center',
  privacy: '/v1/enterprise-trust/privacy',
  dataProtection: '/v1/enterprise-trust/data-protection',
  risks: '/v1/enterprise-trust/risks',
  incidents: '/v1/enterprise-trust/incidents',
  evidence: '/v1/enterprise-trust/evidence',
  vendors: '/v1/enterprise-trust/vendors',
  aiSecurity: '/v1/enterprise-trust/ai-security',
};
