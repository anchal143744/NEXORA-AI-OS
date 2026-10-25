import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(process.env.NEXORA_ROOT || process.cwd());
const targetRelease = '2.0.0';
const currentRelease = '1.9.0-src.1';
const startedAt = Date.now();
const blockers = [];
const warnings = [];
const checks = [];

const requiredFiles = [
  'Dockerfile.api', 'Dockerfile.web', 'Dockerfile.worker',
  'docker-compose.yml', 'docker-compose.staging.yml', 'docker-compose.production.yml',
  'infra/env/.env.production.example', 'infra/env/.env.staging.example',
  'infra/kubernetes/api-deployment.yaml', 'infra/kubernetes/web-deployment.yaml',
  'infra/kubernetes/worker-deployment.yaml', 'infra/kubernetes/redis-deployment.yaml',
  'infra/kubernetes/postgres-statefulset.yaml', 'infra/kubernetes/ingress.yaml', 'infra/kubernetes/hpa.yaml',
  'infra/nginx/nexora.conf',
  'scripts/api-e2e-health-check.mjs', 'scripts/staging-e2e-user-journey.mjs',
  'scripts/staging-load-test.mjs', 'scripts/production-launch-gate.mjs',
  'docs/frontend-phase-10-production-launch.md', 'docs/production-launch-report.md',
  'docs/production-deployment-report.md', 'docs/infrastructure-verification-report.md',
  'docs/production-smoke-test-report.md', 'docs/production-performance-report.md',
  'docs/production-security-validation-report.md', 'docs/monitoring-recovery-report.md',
  'docs/production-release-notes.md', 'docs/portfolio-assets.md',
  'README.md', 'CHANGELOG.md', 'docs/roadmap.md', 'docs/changelog.md', 'docs/current-status.md',
];

const docTokens = {
  'docs/frontend-phase-10-production-launch.md': ['Production Deployment Report', 'Final Validation Report', 'Go / No-Go Recommendation'],
  'docs/production-launch-report.md': ['Production Launch Score', 'Go / No-Go Recommendation', 'Release-blocking'],
  'docs/infrastructure-verification-report.md': ['PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
  'docs/production-smoke-test-report.md': ['Homepage', 'Signup', 'Login', 'AI Copilot'],
  'docs/production-performance-report.md': ['Initial Load', 'Dashboard Render Time', 'Bundle Size'],
  'docs/production-security-validation-report.md': ['HTTPS', 'JWT', 'CSP', 'Rate Limiting'],
  'docs/monitoring-recovery-report.md': ['Health Checks', 'Backup Strategy', 'Rollback Plan'],
  'docs/production-release-notes.md': ['v2.0.0', 'No-Go', 'Release Candidate'],
  'docs/portfolio-assets.md': ['Resume Summary', 'Portfolio Description', 'LinkedIn Project Summary'],
};

function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function readJson(file) { return JSON.parse(read(file).replace(/^\uFEFF/, '')); }
function exists(file) { return fs.existsSync(path.join(root, file)); }
function check(name, passed, details = {}) { checks.push({ name, passed, ...details }); return passed; }
function block(message) { blockers.push(message); }
function warn(message) { warnings.push(message); }
function command(commandName, args = ['--version']) {
  const result = spawnSync(commandName, args, { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' });
  return { available: result.status === 0, status: result.status, stdout: (result.stdout || '').trim(), stderr: (result.stderr || '').trim() };
}
function tcp(host, port, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;
    const finish = (ok, error) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve({ ok, host, port, error });
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false, 'timeout'));
    socket.once('error', (error) => finish(false, error.message));
    socket.connect(port, host);
  });
}
async function http(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  const started = performance.now();
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: 'manual' });
    return { ok: response.status >= 200 && response.status < 300, status: response.status, durationMs: Math.round(performance.now() - started) };
  } catch (error) {
    return { ok: false, error: error.message, durationMs: Math.round(performance.now() - started) };
  } finally {
    clearTimeout(timer);
  }
}

const missingFiles = requiredFiles.filter((file) => !exists(file));
if (!check('Required production launch files exist', missingFiles.length === 0, { missingFiles })) block(`Missing files: ${missingFiles.join(', ')}`);

const pkg = readJson('package.json');
const apiPkg = readJson('apps/api/package.json');
const webPkg = readJson('apps/web/package.json');
check('Root version is still release-candidate source version', pkg.version === currentRelease, { current: pkg.version });
check('API version aligned', apiPkg.version === currentRelease, { current: apiPkg.version });
check('Web version aligned', webPkg.version === currentRelease, { current: webPkg.version });
if (pkg.version === targetRelease) block('Package metadata is v2.0.0 before production blockers are cleared.');
if (pkg.scripts?.['production:launch-gate'] !== 'node scripts/production-launch-gate.mjs') block('production:launch-gate script is not registered.');

const envText = exists('infra/env/.env.production.example') ? read('infra/env/.env.production.example') : '';
const envTokens = ['NODE_ENV=production', 'DATABASE_URL=', 'REDIS_URL=', 'JWT_ACCESS_SECRET=', 'JWT_REFRESH_SECRET=', 'OPENAI_API_KEY=', 'S3_ENDPOINT=', 'S3_BUCKET=', 'RATE_LIMIT_TENANT_WINDOW=', 'LOG_LEVEL=info'];
const missingEnvTokens = envTokens.filter((token) => !envText.includes(token));
if (!check('Production env template covers required settings', missingEnvTokens.length === 0, { missingEnvTokens })) block(`Production env template missing: ${missingEnvTokens.join(', ')}`);
if (envText.includes('replace-with-secret') || envText.includes('change-me')) warn('Production env template contains example secret markers; real secrets must come from a secret manager.');

const compose = exists('docker-compose.production.yml') ? read('docker-compose.production.yml') : '';
for (const token of ['postgres', 'redis', 'minio', 'migrate', 'api', 'worker', 'nginx']) {
  if (!check(`Production compose includes ${token}`, compose.includes(token))) block(`Production compose missing ${token}.`);
}

for (const [doc, tokens] of Object.entries(docTokens)) {
  if (!exists(doc)) { block(`Missing documentation: ${doc}`); continue; }
  const text = read(doc);
  const missingTokens = tokens.filter((token) => !text.includes(token));
  if (!check(`${doc} includes required sections`, missingTokens.length === 0, { missingTokens })) block(`${doc} missing sections: ${missingTokens.join(', ')}`);
}

const postgres = await tcp(process.env.PRODUCTION_DB_HOST || '127.0.0.1', Number(process.env.PRODUCTION_DB_PORT || 5432));
if (!check('PostgreSQL TCP connectivity', postgres.ok, postgres)) block(`PostgreSQL is not reachable at ${postgres.host}:${postgres.port}.`);

const redis = await tcp(process.env.PRODUCTION_REDIS_HOST || '127.0.0.1', Number(process.env.PRODUCTION_REDIS_PORT || 6379));
if (!check('Redis TCP connectivity', redis.ok, redis)) block(`Redis is not reachable at ${redis.host}:${redis.port}; API E2E, queues, realtime and workers cannot be validated.`);

const docker = command('docker');
if (!check('Docker CLI availability', docker.available, docker)) block('Docker is not installed or not available on PATH.');

const webBuild = exists('apps/web/.next/server/app-paths-manifest.json');
if (!check('Next production build artifact exists', webBuild)) block('Next production build artifact missing; run npm.cmd run web:build.');
const apiBuild = exists('apps/api/dist/main.js');
if (!check('Nest production build artifact exists', apiBuild)) block('Nest production build artifact missing; run npm.cmd run api:build.');

const webUrl = process.env.NEXORA_PRODUCTION_WEB_URL;
const apiUrl = process.env.NEXORA_PRODUCTION_API_URL;
if (!webUrl) block('NEXORA_PRODUCTION_WEB_URL is not provided; hosted production web smoke cannot run.');
else {
  const result = await http(webUrl);
  if (!check('Production homepage smoke', result.ok, { url: webUrl, ...result })) block(`Production homepage smoke failed at ${webUrl}.`);
}
if (!apiUrl) block('NEXORA_PRODUCTION_API_URL is not provided; hosted production API smoke cannot run.');
else {
  const base = apiUrl.replace(/\/$/, '');
  const live = await http(`${base}/api/v1/health/live`);
  const swagger = await http(`${base}/docs-json`);
  if (!check('Production API live health', live.ok, { url: `${base}/api/v1/health/live`, ...live })) block(`Production API live health failed at ${base}.`);
  if (!check('Production Swagger JSON', swagger.ok, { url: `${base}/docs-json`, ...swagger })) block(`Production Swagger JSON failed at ${base}.`);
}

if (!process.env.NEXORA_LIGHTHOUSE_REPORT_PATH || !exists(process.env.NEXORA_LIGHTHOUSE_REPORT_PATH)) block('Hosted Lighthouse report is missing; production web quality targets are unverified.');

const score = Math.max(0, 100 - blockers.length * 8 - warnings.length * 2);
const report = {
  status: 'completed',
  targetRelease,
  currentRelease: pkg.version,
  decision: blockers.length === 0 ? 'GO' : 'NO_GO',
  productionLaunchScore: score,
  checkedAt: new Date().toISOString(),
  durationMs: Date.now() - startedAt,
  checks,
  blockers,
  warnings,
  requiredFiles: requiredFiles.length,
};
console.log(JSON.stringify(report, null, 2));
process.exit(0);