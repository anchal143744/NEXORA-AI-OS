# Monitoring Guide

NEXORA now emits structured JSON logs, Prometheus metrics and OTLP-compatible trace payloads.

## Metrics

Prometheus scrape path: `/api/metrics`.

Metric families include:

- `nexora_http_requests_total`
- `nexora_http_request_duration_ms`
- `nexora_database_queries_total`
- `nexora_database_query_duration_ms`
- `nexora_redis_operations_total`
- `nexora_bullmq_jobs_total`
- `nexora_ai_executions_total`
- `nexora_event_processing_total`
- `nexora_auth_attempts_total`
- process CPU, memory and uptime metrics

## Logs

All Nest logs flow through `LoggingService` as JSON with request, correlation, trace, tenant, workspace and user identifiers. Sensitive keys are redacted before stdout/stderr emission.

## Traces

Set `OTEL_EXPORTER_OTLP_ENDPOINT` or `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` to export trace spans to an OpenTelemetry collector.