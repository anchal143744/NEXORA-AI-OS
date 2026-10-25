import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('C:/Users/Acer/OneDrive/Desktop/NEXORA_AI');
const release = '1.9.0-src.1';
const requiredFiles = [
  'docker-compose.staging.yml',
  'infra/env/.env.staging.example',
  'ops/staging/staging-demo-data.json',
  'ops/staging/staging-environment-checklist.md',
  'scripts/staging-demo-seed.mjs',
  'scripts/staging-e2e-user-journey.mjs',
  'scripts/staging-load-test.mjs',
  'scripts/staging-release-candidate-audit.mjs',
  'tests/phase9-staging-release-candidate.test.mjs',
  'docs/frontend-phase-9-staging-release-candidate.md',
  'docs/staging-deployment-report.md',
  'docs/staging-e2e-qa-report.md',
  'docs/staging-security-report.md',
  'docs/staging-performance-report.md',
  'docs/staging-lighthouse-report.md',
  'docs/staging-load-test-report.md',
  'docs/staging-bug-triage-report.md',
  'docs/staging-release-readiness-report.md',
  'README.md',
  'CHANGELOG.md',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) fail('Missing staging SRC files', { missing });

const pkg = readJson('package.json');
const webPkg = readJson('apps/web/package.json');
if (pkg.version !== release || webPkg.version !== release) fail('SRC version mismatch', { root: pkg.version, web: webPkg.version, expected: release });
if (pkg.scripts?.['web:src'] !== 'node scripts/staging-release-candidate-audit.mjs') fail('Missing web:src script', {});
if (pkg.scripts?.['staging:e2e'] !== 'node scripts/staging-e2e-user-journey.mjs') fail('Missing staging:e2e script', {});
if (pkg.scripts?.['staging:load'] !== 'node scripts/staging-load-test.mjs') fail('Missing staging:load script', {});
if (pkg.scripts?.['staging:seed'] !== 'node scripts/staging-demo-seed.mjs') fail('Missing staging:seed script', {});

const stagingEnv = read('infra/env/.env.staging.example');
for (const token of ['NODE_ENV=staging', 'DATABASE_URL=', 'REDIS_URL=', 'NEXT_PUBLIC_API_URL=', 'CORS_ORIGINS=', 'JWT_ACCESS_SECRET=', 'JWT_REFRESH_SECRET=']) {
  if (!stagingEnv.includes(token)) fail('Staging env template missing ' + token, {});
}

const compose = read('docker-compose.staging.yml');
for (const token of ['nexora-api-staging', 'nexora-web-staging', 'nexora-worker-staging', 'nexora-ai-worker-staging', 'postgres', 'redis', 'minio', 'nginx']) {
  if (!compose.includes(token)) fail('Staging compose missing ' + token, {});
}

const seed = readJson('ops/staging/staging-demo-data.json');
const seedIndustries = new Set(seed.organizations.map((organization) => organization.profile.industry));
for (const industry of ['saas', 'retail', 'manufacturing', 'healthcare', 'agency']) {
  if (!seedIndustries.has(industry)) fail('Seed fixture missing industry ' + industry, {});
}

assertIncludes('docs/frontend-phase-9-staging-release-candidate.md', ['Staging Deployment Report', 'End-to-End QA Report', 'Security Report', 'Performance Report', 'Lighthouse Report', 'Load Test Report', 'Bug Triage Report', 'Validation Summary', 'Release Readiness Score', 'Go / No-Go Recommendation']);
assertIncludes('docs/staging-e2e-qa-report.md', ['Signup', 'Login', 'Organization Creation', 'Workspace Generation', 'AI Copilot']);
assertIncludes('docs/staging-security-report.md', ['Authentication', 'Authorization', 'Security Headers', 'Rate Limiting', 'CSP']);
assertIncludes('docs/staging-performance-report.md', ['Page load', 'Dashboard render', 'Route transitions', 'Bundle size']);
assertIncludes('docs/staging-lighthouse-report.md', ['Lighthouse', 'Performance >=95', 'Accessibility >=95']);
assertIncludes('docs/staging-load-test-report.md', ['Concurrent users', 'p95', 'Queue']);
assertIncludes('docs/staging-bug-triage-report.md', ['Critical', 'High', 'Medium', 'Low']);
assertIncludes('README.md', ['1.9.0-src.1', 'Staging Release Candidate']);
assertIncludes('CHANGELOG.md', ['1.9.0-src.1 - Staging Release Candidate']);

const buildManifest = path.join(root, 'apps/web/.next/server/app-paths-manifest.json');
const appPaths = fs.existsSync(buildManifest) ? Object.keys(JSON.parse(fs.readFileSync(buildManifest, 'utf8'))).length : 0;
console.log(JSON.stringify({ status: 'passed', release, requiredFiles: requiredFiles.length, seedOrganizations: seed.organizations.length, seedIndustries: Array.from(seedIndustries), buildManifest: { available: fs.existsSync(buildManifest), appPaths }, scope: 'staging-release-candidate-src' }, null, 2));

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}
function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}
function assertIncludes(relativePath, tokens) {
  const text = read(relativePath);
  const missingTokens = tokens.filter((token) => !text.includes(token));
  if (missingTokens.length) fail('Missing expected tokens in ' + relativePath, { missingTokens });
}
function fail(message, details) {
  console.error(JSON.stringify({ status: 'failed', message, ...details }, null, 2));
  process.exit(1);
}
