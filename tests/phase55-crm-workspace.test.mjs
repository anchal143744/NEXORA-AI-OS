import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');

test('Phase 55 CRM workspace files exist', () => {
  [
    'apps/web/types/crm-workspace.ts',
    'apps/web/lib/crm-workspace.ts',
    'apps/web/stores/crm-workspace-store.ts',
    'apps/web/features/crm/crm-workspace.tsx',
    'apps/web/app/crm/page.tsx',
    'apps/web/app/workspace/crm/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('CRM opportunity stages cover the complete requested pipeline', () => {
  const source = read('apps/web/lib/crm-workspace.ts');
  ['lead', 'qualified', 'discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost'].forEach((stage) => {
    assert.match(source, new RegExp("id: '" + stage + "'"));
  });
});

test('AI Sales Copilot handles its command intents on the backend', () => {
  const source = read('apps/api/src/modules/crm/crm.service.ts');
  ['hot lead', 'forecast', 'risk', 'pipeline health', 'next action'].forEach(intent => assert.ok(source.includes(intent)));
  assert.match(source, /runSalesCommand/);

});

test('CRM workspace renders all required enterprise modules', () => {
  const source = read('apps/web/features/crm/crm-workspace.tsx');
  ['CrmHome', 'LeadManagement', 'ContactManagement', 'AccountManagement', 'OpportunityManagement', 'VisualSalesPipeline', 'ActivityCenter', 'CustomerTimeline', 'QuoteProposalWorkspace', 'RevenueForecasting', 'RevenueOperationsDashboard', 'AiSalesCopilot'].forEach((name) => {
    assert.match(source, new RegExp(name));
  });
});
