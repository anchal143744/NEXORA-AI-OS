const baseUrl = process.env.API_BASE_URL ?? 'http://127.0.0.1:4000';
const iterations = Number(process.env.BENCHMARK_REQUESTS ?? 25);
const target = `${baseUrl}/api/v1/health/live`;
const samples = [];

for (let index = 0; index < iterations; index += 1) {
  const started = performance.now();
  const response = await fetch(target);
  const durationMs = performance.now() - started;
  samples.push(durationMs);
  if (!response.ok) throw new Error(`Benchmark target returned ${response.status}`);
}

samples.sort((a, b) => a - b);
const percentile = (p) => samples[Math.min(samples.length - 1, Math.floor(samples.length * p))];
const result = { target, iterations, minMs: samples[0], p50Ms: percentile(0.5), p95Ms: percentile(0.95), maxMs: samples.at(-1), averageMs: samples.reduce((sum, value) => sum + value, 0) / samples.length };
console.log(JSON.stringify(result, null, 2));