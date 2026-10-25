# Staging Load Test Report

## Automation

npm.cmd run staging:load drives concurrent users against API and web staging targets. Use SRC_LOAD_TARGETS to isolate target groups when a dependency is intentionally offline.

## Local SRC Evidence

Web-only load used NEXORA_WEB_URL=http://127.0.0.1:3014, SRC_LOAD_TARGETS=web-home,web-command-center, SRC_LOAD_DURATION_MS=1000 and SRC_LOAD_REQUEST_TIMEOUT_MS=5000.

Results:

- Home route p95 at 20 concurrency: 39.85 ms, error rate 0.
- Command Center p95 at 20 concurrency: 57.17 ms, error rate 0.

## API Load Status

API load is blocked until Redis is installed/running and /api/v1/health/ready reports database, Redis and queues as healthy.

## Queue Validation

BullMQ and workflow queue throughput require a hosted staging profile with representative background job volume. Queue saturation, retry and dead-letter behavior remain mandatory before public launch.

## Metrics

- Concurrent users.
- p95 latency.
- Queue readiness after Redis is online.

