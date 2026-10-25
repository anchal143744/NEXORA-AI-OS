import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('Phase 56 People workspace files exist', () => {
  [
    'apps/web/types/people-workspace.ts',
    'apps/web/lib/people-workspace.ts',
    'apps/web/stores/people-workspace-store.ts',
    'apps/web/features/people/people-workspace.tsx',
    'apps/web/app/people/page.tsx',
    'apps/web/app/workspace/hr/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Candidate pipeline stages cover the requested hiring flow', () => {
  const source = read('apps/web/lib/people-workspace.ts');
  ['applied', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected'].forEach((stage) => {
    assert.match(source, new RegExp("id: '" + stage + "'"));
  });
});

test('AI HR Copilot supports required command intents', () => {
  const source = read('apps/web/lib/people-workspace.ts');
  ['on leave', 'attendance', 'promotion', 'hiring pipeline', 'skill gap', 'training'].forEach((intent) => {
    assert.match(source, new RegExp(intent));
  });
});

test('People workspace renders all required modules', () => {
  const source = read('apps/web/features/people/people-workspace.tsx');
  ['HrHome', 'EmployeeDirectory', 'AttendanceManagement', 'LeaveManagement', 'HiringWorkspace', 'CandidatePipeline', 'PerformanceManagement', 'GoalsReviews', 'LearningDevelopment', 'OrganizationChart', 'WorkforceAnalytics', 'AiHrCopilot'].forEach((name) => {
    assert.match(source, new RegExp(name));
  });
});

test('People navigation keeps the requested simple grouping', () => {
  const source = read('apps/web/lib/people-workspace.ts');
  ['People', 'Hiring', 'Growth', 'Organization', 'Employees', 'Attendance', 'Leave', 'Jobs', 'Candidates', 'Interviews', 'Performance', 'Learning', 'Goals', 'Teams', 'Org Chart', 'Workforce Analytics'].forEach((label) => {
    assert.match(source, new RegExp(label));
  });
});
