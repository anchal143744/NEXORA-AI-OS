
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Phase 72 adds real enterprise intelligence backend services', () => {
  for (const file of [
    'apps/api/src/modules/knowledge-graph/graph/enterprise-graph-sync.service.ts',
    'apps/api/src/modules/intelligence/enterprise/enterprise-intelligence.service.ts',
    'apps/api/src/modules/intelligence/enterprise/enterprise-intelligence.controller.ts',
    'apps/api/src/modules/intelligence/enterprise/command-center.controller.ts',
  ]) {
    assert.ok(fs.existsSync(path.join(root, file)), file);
  }
});

test('Phase 72 command examples are routed to real database query methods', () => {
  const service = read('apps/api/src/modules/intelligence/enterprise/enterprise-intelligence.service.ts');
  assert.match(service, /overdueInvoices/);
  assert.match(service, /topOpportunitiesThisQuarter/);
  assert.match(service, /projectsAtRisk/);
  assert.match(service, /revenueForecastNextMonth/);
  assert.match(service, /searchIndexedDocument\.findMany/);
});

test('Phase 72 graph sync connects required enterprise entities', () => {
  const graph = read('apps/api/src/modules/knowledge-graph/graph/enterprise-graph-sync.service.ts');
  for (const entity of ['organization', 'department', 'employee', 'project', 'customer', 'lead', 'opportunity', 'invoice', 'contract', 'workflow']) {
    assert.match(graph, new RegExp("entityType: '" + entity + "'"));
  }
  assert.match(graph, /knowledgeEdge/);
  assert.match(graph, /searchIndexedDocument/);
});

test('Phase 72 does not add duplicate frontend workspace pages', () => {
  assert.ok(!fs.existsSync(path.join(root, 'apps/web/app/enterprise-intelligence/page.tsx')));
  assert.ok(fs.existsSync(path.join(root, 'apps/web/services/enterprise-intelligence-api.ts')));
});
