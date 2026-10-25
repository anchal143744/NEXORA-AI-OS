import { assertRegisteredWorkspaceModule } from './helpers/web-contracts.mjs';
import { assertReleaseVersions } from './helpers/web-contracts.mjs';
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('Phase 64 ecosystem marketplace files exist', () => {
  [
    'apps/web/types/ecosystem-marketplace.ts',
    'apps/web/lib/ecosystem-marketplace.ts',
    'apps/web/services/ecosystem-marketplace-api.ts',
    'apps/web/stores/ecosystem-marketplace-store.ts',
    'apps/web/hooks/use-ecosystem-marketplace-actions.ts',
    'apps/web/features/ecosystem-marketplace/ecosystem-marketplace-workspace.tsx',
    'apps/web/app/ecosystem-marketplace/page.tsx',
    'apps/web/app/workspace/ecosystem-marketplace/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Ecosystem workspace covers all requested modules', () => {
  const source = read('apps/web/features/ecosystem-marketplace/ecosystem-marketplace-workspace.tsx');
  [
    'EnterpriseMarketplace',
    'AiAgentMarketplace',
    'ApplicationMarketplace',
    'IntegrationMarketplace',
    'PartnerPortal',
    'DeveloperPlatform',
    'DeveloperConsole',
    'ExtensionFramework',
    'MarketplaceBilling',
    'MarketplaceAnalytics',
    'CertificationProgram',
    'EcosystemIntelligenceCenter',
    'AiEcosystemCopilot',
  ].forEach((name) => assert.match(source, new RegExp(name)));
});

test('Ecosystem data covers categories, connectors, certifications and copilot commands', () => {
  const source = read('apps/web/lib/ecosystem-marketplace.ts');
  [
    'CRM',
    'HR',
    'Finance',
    'Analytics',
    'AI Agents',
    'Automation',
    'Integrations',
    'Industry Solutions',
    'Salesforce',
    'HubSpot',
    'SAP',
    'Oracle',
    'Slack',
    'Teams',
    'Zoom',
    'Stripe',
    'AWS',
    'Azure',
    'Google Workspace',
    'Certified App',
    'Certified Integration',
    'Certified Partner',
    'Certified AI Agent',
    'Show top marketplace apps',
    'Show partner growth',
    'Recommend integrations',
    'Analyze marketplace revenue',
    'Show ecosystem health',
  ].forEach((token) => assert.ok(source.includes(token), token));
});

test('Phase 64 route files are physically created', () => {
  [
    'apps/web/app/ecosystem-marketplace/enterprise-marketplace/page.tsx',
    'apps/web/app/ecosystem-marketplace/ai-agent-marketplace/page.tsx',
    'apps/web/app/ecosystem-marketplace/applications/page.tsx',
    'apps/web/app/ecosystem-marketplace/integrations/page.tsx',
    'apps/web/app/ecosystem-marketplace/partners/page.tsx',
    'apps/web/app/ecosystem-marketplace/developer-platform/page.tsx',
    'apps/web/app/ecosystem-marketplace/developer-console/page.tsx',
    'apps/web/app/ecosystem-marketplace/extensions/page.tsx',
    'apps/web/app/ecosystem-marketplace/billing/page.tsx',
    'apps/web/app/ecosystem-marketplace/analytics/page.tsx',
    'apps/web/app/ecosystem-marketplace/certification/page.tsx',
    'apps/web/app/ecosystem-marketplace/intelligence/page.tsx',
    'apps/web/app/ecosystem-marketplace/copilot/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Workspace config registers Ecosystem Marketplace through adaptive navigation metadata', () => {
  assertRegisteredWorkspaceModule('ecosystem-marketplace', '/ecosystem-marketplace', 'Marketplace');
});

test('Phase 64 package versions are present', () => {
  const rootPkg = JSON.parse(read('package.json'));
  const webPkg = JSON.parse(read('apps/web/package.json'));
  const apiPkg = JSON.parse(read('apps/api/package.json'));
  assertReleaseVersions();


});
