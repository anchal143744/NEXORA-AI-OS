import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('Phase 58 AI Agents workspace files exist', () => {
  [
    'apps/web/types/agent-workspace.ts',
    'apps/web/lib/agent-workspace.ts',
    'apps/web/stores/agent-workspace-store.ts',
    'apps/web/features/ai-agents/ai-agents-workspace.tsx',
    'apps/web/app/ai-agents/page.tsx',
    'apps/web/app/workspace/ai/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('AI Agents navigation keeps the requested simple grouping', () => {
  const source = read('apps/web/lib/agent-workspace.ts');
  ['AI Agents', 'Agents', 'Templates', 'Deployments', 'Monitoring', 'Automation', 'Workflows', 'Triggers', 'Executions', 'Insights', 'Analytics', 'Savings', 'ROI'].forEach((label) => {
    assert.match(source, new RegExp(label));
  });
});

test('AI Agent Copilot supports required command intents', () => {
  const source = read('apps/web/lib/agent-workspace.ts');
  ['create a sales agent', 'deploy an hr assistant', 'failing agents', 'optimize workflows', 'automation savings', 'recommend new automations'].forEach((intent) => {
    assert.match(source.toLowerCase(), new RegExp(intent));
  });
});

test('AI Agents workspace renders all required modules', () => {
  const source = read('apps/web/features/ai-agents/ai-agents-workspace.tsx');
  ['AiAgentsHome', 'AgentBuilder', 'AgentTemplatesMarketplace', 'AgentDeploymentCenter', 'AgentMonitoring', 'AgentExecutionHistory', 'AgentPermissions', 'MultiAgentCollaboration', 'WorkflowAutomationCenter', 'AgentAnalytics', 'EnterpriseAutomationDashboard', 'AiAgentCopilot'].forEach((name) => {
    assert.match(source, new RegExp(name));
  });
});

test('AI Agents routes are physically created', () => {
  [
    'apps/web/app/ai-agents/agents/page.tsx',
    'apps/web/app/ai-agents/templates/page.tsx',
    'apps/web/app/ai-agents/deployments/page.tsx',
    'apps/web/app/ai-agents/monitoring/page.tsx',
    'apps/web/app/ai-agents/executions/page.tsx',
    'apps/web/app/ai-agents/permissions/page.tsx',
    'apps/web/app/ai-agents/collaboration/page.tsx',
    'apps/web/app/ai-agents/workflows/page.tsx',
    'apps/web/app/ai-agents/analytics/page.tsx',
    'apps/web/app/ai-agents/automation/page.tsx',
    'apps/web/app/ai-agents/copilot/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});
