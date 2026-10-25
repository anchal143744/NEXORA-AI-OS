# Scaling Guide

## Horizontal Scaling

- API scales with `nexora-api-hpa` using CPU and memory metrics.
- Worker scales with `nexora-worker-hpa` using CPU and memory metrics.
- Redis and PostgreSQL should be managed services or clustered for production.

## Bottleneck Signals

- High `nexora_http_request_duration_ms` p95.
- Rising `nexora_database_query_duration_ms` and query errors.
- Rising `nexora_bullmq_jobs_total` without matching completion throughput.
- Increased memory RSS or CPU usage percent.

## Scale Actions

1. Increase API replicas for request latency.
2. Increase worker replicas for queue backlog.
3. Add database read replicas when query saturation appears.
4. Add Redis memory and persistence capacity for queue depth.