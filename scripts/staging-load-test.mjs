const apiBaseUrl = process.env.NEXORA_API_URL || process.env.API_BASE_URL || 'http://127.0.0.1:4000';
const webBaseUrl = process.env.NEXORA_WEB_URL || process.env.WEB_BASE_URL || 'http://127.0.0.1:3001';
const concurrencyLevels = (process.env.SRC_LOAD_CONCURRENCY || '1,5,10,20').split(',').map((value) => Number(value.trim())).filter(Boolean);
const durationMs = Number(process.env.SRC_LOAD_DURATION_MS || 5000);
const p95BudgetMs = Number(process.env.SRC_LOAD_P95_BUDGET_MS || 750);
const requestTimeoutMs = Number(process.env.SRC_LOAD_REQUEST_TIMEOUT_MS || 1500);
const configuredTargets = (process.env.SRC_LOAD_TARGETS || 'api-live,api-ready,web-home,web-command-center')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const allTargets = [
  { name: 'api-live', url: apiBaseUrl + '/api/v1/health/live' },
  { name: 'api-ready', url: apiBaseUrl + '/api/v1/health/ready' },
  { name: 'web-home', url: webBaseUrl + '/' },
  { name: 'web-command-center', url: webBaseUrl + '/command-center' },
];
const targets = allTargets.filter((target) => configuredTargets.includes(target.name));
if (!targets.length) throw new Error('SRC_LOAD_TARGETS did not match any known targets.');

const results = [];
for (const target of targets) {
  for (const concurrency of concurrencyLevels) results.push(await runTarget(target, concurrency));
}

const failed = results.filter((result) => result.errorRate > 0 || result.p95Ms > p95BudgetMs);
console.log(JSON.stringify({ status: failed.length ? 'failed' : 'passed', durationMs, requestTimeoutMs, p95BudgetMs, targets: targets.map((target) => target.name), results }, null, 2));
if (failed.length) process.exit(1);

async function runTarget(target, concurrency) {
  const samples = [];
  let errors = 0;
  let total = 0;
  const startedAt = Date.now();
  async function worker() {
    while (Date.now() - startedAt < durationMs) {
      const t0 = performance.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
        const response = await fetch(target.url, { cache: 'no-store', signal: controller.signal });
        clearTimeout(timeout);
        const elapsed = performance.now() - t0;
        samples.push(elapsed);
        total += 1;
        if (!response.ok) errors += 1;
        await response.arrayBuffer();
      } catch {
        total += 1;
        errors += 1;
        samples.push(performance.now() - t0);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  samples.sort((a, b) => a - b);
  return {
    target: target.name,
    url: target.url,
    concurrency,
    requests: total,
    errors,
    errorRate: total ? Number((errors / total).toFixed(4)) : 1,
    minMs: round(samples[0] ?? 0),
    p50Ms: round(percentile(samples, 0.5)),
    p95Ms: round(percentile(samples, 0.95)),
    maxMs: round(samples.at(-1) ?? 0),
  };
}

function percentile(samples, p) {
  if (!samples.length) return 0;
  return samples[Math.min(samples.length - 1, Math.floor(samples.length * p))];
}

function round(value) {
  return Math.round(value * 100) / 100;
}
