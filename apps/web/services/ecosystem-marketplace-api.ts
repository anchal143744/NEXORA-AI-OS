import {
  agentTemplates,
  applicationLifecycle,
  certificationPrograms,
  developerConsoleItems,
  developerResources,
  ecosystemCopilotCommands,
  ecosystemInsights,
  ecosystemMetrics,
  extensionCapabilities,
  integrationConnectors,
  marketplaceAnalyticsSignals,
  marketplaceBillingPlans,
  marketplaceCategories,
  marketplaceListings,
  partnerPrograms,
} from '@/lib/ecosystem-marketplace';

export async function getEcosystemMarketplaceSnapshot() {
  return {
    metrics: ecosystemMetrics,
    categories: marketplaceCategories,
    listings: marketplaceListings,
    agentTemplates,
    applications: applicationLifecycle,
    integrations: integrationConnectors,
    partners: partnerPrograms,
    developerResources,
    developerConsole: developerConsoleItems,
    extensions: extensionCapabilities,
    billing: marketplaceBillingPlans,
    analytics: marketplaceAnalyticsSignals,
    certifications: certificationPrograms,
    insights: ecosystemInsights,
    copilot: ecosystemCopilotCommands,
    generatedAt: new Date().toISOString(),
  };
}

export const ecosystemMarketplaceEndpoints = {
  marketplace: '/v1/marketplace',
  aiAgents: '/v1/ai-agent-marketplace',
  applications: '/v1/application-marketplace',
  integrations: '/v1/integration-marketplace',
  partners: '/v1/partners',
  developerPlatform: '/v1/developer-platform',
  developerConsole: '/v1/developer-console',
  extensions: '/v1/extensions',
  billing: '/v1/marketplace-billing',
  analytics: '/v1/marketplace-analytics',
  certifications: '/v1/certifications',
  intelligence: '/v1/ecosystem-intelligence',
};
