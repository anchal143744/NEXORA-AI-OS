# Performance Audit

## Implemented Benchmarks

- `npm.cmd run api:benchmark` measures health endpoint latency against a running API.
- Prometheus histograms measure HTTP, database, Redis, queue, event and AI latency.
- CPU, memory, uptime and load metrics are exported.

## Production Targets

- API p95 latency under 250 ms for health and low-cost read endpoints.
- Worker queue processing p95 under 1000 ms for non-AI jobs.
- AI execution latency tracked per provider/model.