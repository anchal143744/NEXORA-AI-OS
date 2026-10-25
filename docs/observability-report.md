# Observability Report

## Implemented

- Request correlation IDs through `x-request-id` and `x-correlation-id`.
- W3C `traceparent` propagation.
- OTLP-compatible trace export for HTTP, Prisma, Redis, BullMQ, events, WebSocket and AI execution paths.
- Prometheus endpoint at `/api/metrics`.
- Structured JSON logging with tenant, workspace, user, request and trace context.
- Sensitive field redaction before log emission.

## Coverage

| Surface | Status |
| --- | --- |
| HTTP requests | Instrumented |
| Prisma queries | Instrumented through client extension |
| Redis connect/cache/pubsub | Instrumented |
| BullMQ processors | Instrumented |
| Event bus publish/process | Instrumented |
| WebSocket connect/subscribe/publish | Instrumented |
| AI provider executions | Instrumented |
| Auth guard | Instrumented |