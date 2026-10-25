export const dataResidencyApi = {
  dataResidency: '/v1/data-residency',
  dataSovereignty: '/v1/data-sovereignty',
  regulatory: '/v1/regulatory',
  compliance: '/v1/compliance',
  jurisdictions: '/v1/jurisdictions',
  dataRegions: '/v1/data-regions',
  regulatoryIntelligence: '/v1/regulatory-intelligence',
  complianceAlerts: '/v1/compliance-alerts',
} as const;

export type DataResidencyApiGroup = keyof typeof dataResidencyApi;