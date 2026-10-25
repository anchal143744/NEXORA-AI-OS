export const securityIntelligenceApi = {
  security: '/v1/security',
  securityIntelligence: '/v1/security-intelligence',
  threatDetection: '/v1/threat-detection',
  securityAudit: '/v1/security-audit',
  securityIncidents: '/v1/security-incidents',
  securityAlerts: '/v1/security-alerts',
  zeroTrust: '/v1/zero-trust',
  securityRisk: '/v1/security-risk',
} as const;

export type SecurityIntelligenceApiGroup = keyof typeof securityIntelligenceApi;